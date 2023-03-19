import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { BookingSectionForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerBookingSection } from '@app/_interfaces/locker.interface';
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
  public viewContent: ViewType;
  public viewType = ViewType;
  public formFields: GFormFields = BookingSectionForm;
  public formOptions: GFormOptions = LockerFormOptions;
  private modelTemplate = {
    images: ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'],
    urls: ['url1', 'url2', 'url3', 'url4', 'url5', 'url6'],
  };

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

  public async uploadImages(form: FormGroup) {
    const models = this.modelTemplate.images;
    const urls = [];

    await Promise.all(models.map(async (image) => {
      const file: File = form.value[image];

      if (!Boolean(file)) {
        return;
      }

      const fileRef = this.storage.ref(file.name);
      const task = this.storage.upload(file.name, file);

      await task.snapshotChanges().pipe(
        finalize(
          async () => fileRef.getDownloadURL().subscribe(url => urls.push(url))
        )
      ).toPromise();
    }));

    return urls;
  }

  public async writeBookingSection(form: FormGroup) {
    this.loader.start();

    let body: any = {
      title: form.value.title,
      content: form.value.content,
      type: form.value.type,
      position: form.value.position
    };

    switch (form.value.type) {
      case 'GALLERY':
        const galleryUrls = await this.uploadImages(form);

        body = {
          ...body,
          urls: galleryUrls
        };

        break;
      case 'VIDEO':
        const models = this.modelTemplate.urls;
        models.forEach(model => {
          const url = form.value[model];
          const videoUrls = [];

          if (Boolean(url)) {
            videoUrls.push(url);
          }

          body = {
            ...body,
            urls: videoUrls
          };
        });
        break;
    }

    this.lockerService[this.bookingSection ? 'updateBookingSection' : 'createBookingSection']({
      bookingSection: body, id: this.bookingSection ? this.bookingSection.id : form.value.title.replace(/ /g, '').toLowerCase(),
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

}
