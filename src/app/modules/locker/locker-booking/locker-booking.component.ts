import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { BookingSectionForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerBookingSection, LockerBookingSectionPhoto } from '@app/_interfaces/locker.interface';
import { AlertService } from '@app/_widgets/alert';
import { LockerService } from '@app/services/locker.service';
import { GFormFields, GFormOptions, GsFormComponent, GsFormsService } from '@gs/ng-forms';
import 'firebase/storage';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-locker-booking',
  templateUrl: './locker-booking.component.html',
  styleUrls: [
    './locker-booking.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerBookingComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  private alertContext: any;
  public bookingSection: LockerBookingSection;
  public bookingSectionCollections: Array<LockerBookingSection>;
  public bookingSectionPhotos: Array<LockerBookingSectionPhoto>;
  public viewContent: ViewType;
  public viewType = ViewType;
  public formFields: GFormFields = BookingSectionForm;
  public formOptions: GFormOptions = LockerFormOptions;

  @ViewChild(GsFormComponent, { static: false }) formComponent: GsFormComponent;

  constructor(
    private lockerService: LockerService,
    private storage: AngularFireStorage,
    private loader: NgxUiLoaderService,
    private alertService: AlertService,
    private gsFormService: GsFormsService
  ) { }
  ngOnInit() {
    this.getSectionCollections();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private getSectionCollections() {
    this.loader.start();
    this.lockerService.listBookingSectionCollection()
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(sectionCollections => {
        this.bookingSectionCollections = sectionCollections;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerBookingComponent.getBookingSection');
        this.loader.stop();
      });
  }

  public getBookingSectionPhotos(bookingSection: LockerBookingSection) {
    this.loader.start();
    this.lockerService.getBookingSectionPhotoDocument(bookingSection.id)
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(galleryDocuments => {
        this.bookingSection = bookingSection;
        this.viewContent = ViewType.DETAIL;
        this.bookingSectionPhotos = galleryDocuments;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerBookingComponent.getBookingSectionPhotos');
        this.loader.stop();
      });
  }

  public addNewBookingSection() {
    this.loader.start();
    this.viewContent = ViewType.ADD;
    this.bookingSection = null;

    setTimeout(() => {
      if (this.formComponent) {
        this.formComponent.formActions('reset');
      }
      this.loader.stop();
    }, 500);
  }

  public writeBookingSection(form: FormGroup) {
    this.loader.start();

    this.lockerService[this.bookingSection ? 'updateBookingSection' : 'createBookingSection']({
      bookingSection: {
        title: form.value.title,
        type: form.value.type,
        position: form.value.position
      }, id: this.bookingSection ? this.bookingSection.id : form.value.title.replace(/ /g, '').toLowerCase(),
    })
      .then(() => {
        this.formFields = BookingSectionForm;
        this.viewContent = null;
        this.bookingSection = null;
        this.loader.stop();
        this.getSectionCollections();
      })
      .catch(error => {
        this.loader.stop();
        console.error(error, 'LockerBookingComponent.onAddNewBookingSection');
      });
  }

  public onAddImage($event: any): void {
    if (!$event.target.files || !$event.target.files[0]) {
      return;
    }

    this.loader.start();
    const file: File = $event.target.files[0];
    const fileRef = this.storage.ref(file.name);
    const task = this.storage.upload(file.name, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(imageUrl => {
          this.lockerService.createBookingSectionImage(this.bookingSection.id, { img: imageUrl, position: 20 })
            .then(() => {
              this.loader.stop();
              this.getBookingSectionPhotos(this.bookingSection);
            }).catch(error => {
            console.error(error, 'LockerBookingComponent.onAddImage at lockerService.createLockerBookingSectionImage');
            this.loader.stop();
          });
        });
      })
    ).subscribe(() => null, error => {
      this.loader.stop();
      console.error(error, 'LockerBookingComponent.onAddImage at task.snapshotChanges');
    });
  }

  public openAlert(alertContext: any, id: string) {
    this.alertContext = alertContext;
    this.alertService.open(id);
  }

  public closeAlert(id: string) {
    this.alertContext = null;
    this.alertService.close(id);
  }

  public onDeleteBookingSection() {
    if (!this.bookingSection) {
      this.bookingSection = null;
      this.viewContent = null;
      this.closeAlert('deleteBookingSectionAlert');
      return;
    }

    this.loader.start();
    this.lockerService.deleteBookingSection(this.bookingSection.id)
      .then(() => {
        this.closeAlert('deleteBookingSectionAlert');
        this.bookingSection = null;
        this.viewContent = null;
        this.loader.stop();
        this.getSectionCollections();
      })
      .catch(error => {
        console.error(error, 'LockerBookingComponent.onDeleteBookingSection');
        this.closeAlert('deleteBookingSectionAlert');
        this.loader.stop();
      });
  }

  public onDeleteBookingSectionPhoto() {
    this.loader.start();
    const photo = this.alertContext;

    this.lockerService.deleteBookingSectionImage(this.bookingSection.id, photo.id)
      .then(() => {
        this.closeAlert('deleteBookingSectionImageAlert');
        this.getBookingSectionPhotos(this.bookingSection);
        this.loader.stop();
      })
      .catch(error => {
        console.error(error, 'LockerBookingComponent.onDeleteBookingSectionPhoto');
        this.closeAlert('deleteBookingSectionImageAlert');
        this.loader.stop();
      });
  }

  public readBookingSection(galleryId: string): void {
    this.loader.start();

    this.formFields = null;
    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }

    this.lockerService.readBookingSectionDocument(galleryId)
      .pipe(take(1))
      .toPromise()
      .then(bookingSection => {
        this.viewContent = ViewType.EDIT;
        this.bookingSection = bookingSection;
        this.bookingSection.id = galleryId;
        this.formFields = this.gsFormService.patchFormValues(BookingSectionForm, bookingSection);
      })
      .catch(error => console.error(error, 'LockerBookingComponent.readBookingSection'))
      .finally(() => this.loader.stop());
  }

  public updateImagePosition(event: any, photo: LockerBookingSectionPhoto) {
    this.loader.start();

    this.lockerService.changeBookingSectionImagePosition(
      this.bookingSection.id,
      photo.id,
      {
        img: photo.src,
        position: Number(event.target.value)
      }
    ).then(() => {
      this.loader.stop();
      this.getBookingSectionPhotos(this.bookingSection);
    }).catch(error => {
      console.error(error, 'LockerBookingComponent.updateImagePosition');
      this.loader.stop();
    });
  }

}
