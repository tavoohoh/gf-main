import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { AddGalleryForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerGallery, LockerGalleryPhotos } from '@app/_interfaces/locker.interface';
import { AlertService } from '@app/_widgets/alert';
import { LockerService } from '@app/services/locker.service';
import 'firebase/storage';
import { GFormFields, GFormOptions } from 'gs-forms';
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
  public galleryId: string;
  public galleryCollections: Array<LockerGallery>;
  public galleryPhotos: Array<LockerGalleryPhotos>;
  public viewContent: ViewType;
  public currentTitle = '';
  public viewType = ViewType;
  public formAddGalleryFields: GFormFields = AddGalleryForm;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private lockerService: LockerService,
    private storage: AngularFireStorage,
    private loader: NgxUiLoaderService,
    private alertService: AlertService
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
    this.lockerService.listLockerGalleryCollection()
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
    this.lockerService.getLockerGalleryDocument(gallery.id)
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(galleryDocuments => {
        this.galleryId = gallery.id;
        this.viewContent = ViewType.DETAIL;
        this.galleryPhotos = galleryDocuments;
        this.currentTitle = gallery.title;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGalleryPhotos');
        this.loader.stop();
      });
  }

  public addNewGallery() {
    this.viewContent = null;
    this.viewContent = ViewType.ADD;
    this.currentTitle = '';
  }

  public onAddNewGallery(form: FormGroup) {
    this.loader.start();
    const galley = {
      id: form.value.name.replace(/ /g, '').toLowerCase(),
      title: form.value.name
    };

    this.lockerService.createLockerGallery(galley)
      .then(() => {
        this.formAddGalleryFields = AddGalleryForm;
        this.getGalleryPhotos(galley);
        this.loader.stop();
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
          this.lockerService.createLockerGalleryImage(this.galleryId, imageUrl)
          .then(() => this.loader.stop()).catch(error => {
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
    this.lockerService.deleteLockerGallery(this.galleryId)
      .then(() => {
        this.closeAlert('deleteGalleryAlert');
        this.galleryId = null;
        this.viewContent = null;
        this.loader.stop();
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

    this.lockerService.deleteLockerGalleryImage(this.galleryId, photo.id)
      .then(() => {
        this.closeAlert('deleteGalleryImageAlert');
        this.loader.stop();
      })
      .catch(error => {
        console.error(error, 'LockerGalleryComponent.onDeleteGalleryPhoto');
        this.closeAlert('deleteGalleryImageAlert');
        this.loader.stop();
      });
  }

}
