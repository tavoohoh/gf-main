import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { GalleryForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerGallery, LockerGalleryPhoto } from '@app/_interfaces/locker.interface';
import { AlertService } from '@app/_widgets/alert';
import { LockerService } from '@app/services/locker.service';
import 'firebase/storage';
import { GFormFields, GFormOptions, GsFormsComponent, GsFormsService } from 'gs-forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-locker-gallery',
  templateUrl: './locker-gallery.component.html',
  styleUrls: [
    './locker-gallery.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerGalleryComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  private alertContext: any;
  public gallery: LockerGallery;
  public galleryCollections: Array<LockerGallery>;
  public galleryPhotos: Array<LockerGalleryPhoto>;
  public viewContent: ViewType;
  public viewType = ViewType;
  public formFields: GFormFields = GalleryForm;
  public formOptions: GFormOptions = LockerFormOptions;

  @ViewChild(GsFormsComponent, { static: false }) formComponent: GsFormsComponent;

  constructor(
    private lockerService: LockerService,
    private storage: AngularFireStorage,
    private loader: NgxUiLoaderService,
    private alertService: AlertService,
    private gsFormService: GsFormsService
  ) { }

  ngOnInit() {
    this.getGalleryCollections();
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private getGalleryCollections() {
    this.loader.start();
    this.lockerService.listGalleryCollection()
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(galleryCollections => {
        this.galleryCollections = galleryCollections;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGallery');
        this.loader.stop();
      });
  }

  public getGalleryPhotos(gallery: LockerGallery) {
    this.loader.start();
    this.lockerService.getGalleryPhotoDocument(gallery.id)
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(galleryDocuments => {
        this.gallery = gallery;
        this.viewContent = ViewType.DETAIL;
        this.galleryPhotos = galleryDocuments;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGalleryPhotos');
        this.loader.stop();
      });
  }

  public addNewGallery() {
    this.loader.start();
    this.viewContent = ViewType.ADD;
    this.gallery = null;

    setTimeout(() => {
      if (this.formComponent) {
        this.formComponent.formActions('reset');
      }
      this.loader.stop();
    }, 500);
  }

  public writeGallery(form: FormGroup) {
    this.loader.start();

    this.lockerService[this.gallery ? 'updateGallery' : 'createGallery']({
      gallery: {
        title: form.value.title,
        position: form.value.position
      }, id: this.gallery ? this.gallery.id : form.value.title.replace(/ /g, '').toLowerCase(),
    })
      .then(() => {
        this.formFields = GalleryForm;
        this.viewContent = null;
        this.gallery = null;
        this.loader.stop();
        this.getGalleryCollections();
      })
      .catch(error => {
        this.loader.stop();
        console.error(error, 'LockerGalleryComponent.onAddNewGallery');
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
          this.lockerService.createGalleryImage(this.gallery.id, { img: imageUrl, position: 20 })
            .then(() => {
              this.loader.stop();
              this.getGalleryPhotos(this.gallery);
            }).catch(error => {
              console.error(error, 'LockerGalleryComponent.onAddImage at lockerService.createLockerGalleryImage');
              this.loader.stop();
            });
        });
      })
    ).subscribe(() => null, error => {
      this.loader.stop();
      console.error(error, 'LockerGalleryComponent.onAddImage at task.snapshotChanges');
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

  public onDeleteGallery() {
    this.loader.start();
    this.lockerService.deleteGallery(this.gallery.id)
      .then(() => {
        this.closeAlert('deleteGalleryAlert');
        this.gallery = null;
        this.viewContent = null;
        this.loader.stop();
        this.getGalleryCollections();
      })
      .catch(error => {
        console.error(error, 'LockerGalleryComponent.onDeleteGallery');
        this.closeAlert('deleteGalleryAlert');
        this.loader.stop();
      });
  }

  public onDeleteGalleryPhoto() {
    this.loader.start();
    const photo = this.alertContext;

    this.lockerService.deleteGalleryImage(this.gallery.id, photo.id)
      .then(() => {
        this.closeAlert('deleteGalleryImageAlert');
        this.getGalleryPhotos(this.gallery);
        this.loader.stop();
      })
      .catch(error => {
        console.error(error, 'LockerGalleryComponent.onDeleteGalleryPhoto');
        this.closeAlert('deleteGalleryImageAlert');
        this.loader.stop();
      });
  }

  public readGallery(galleryId: string): void {
    this.loader.start();

    this.formFields = null;
    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }

    this.lockerService.readGalleryDocument(galleryId)
      .pipe(take(1))
      .toPromise()
      .then(gallery => {
        this.viewContent = ViewType.EDIT;
        this.gallery = gallery;
        this.gallery.id = galleryId;
        this.formFields = this.gsFormService.patchFormValues(GalleryForm, gallery);
      })
      .catch(error => console.error(error, 'LockerGalleryComponent.readGallery'))
      .finally(() => this.loader.stop());
  }

  public updateImagePosition(event: { target: { value: number } }, photo: LockerGalleryPhoto) {
    this.loader.start();

    this.lockerService.changeGalleryImagePosition(
      this.gallery.id,
      photo.id,
      {
        img: photo.src,
        position: Number(event.target.value)
      }
    ).then(() => {
      this.loader.stop();
      this.getGalleryPhotos(this.gallery);
    }).catch(error => {
      console.error(error, 'LockerGalleryComponent.updateImagePosition');
      this.loader.stop();
    });
  }

}
