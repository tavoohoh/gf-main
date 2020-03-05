import { Component, OnInit, OnDestroy } from '@angular/core';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LockerGallery, LockerGalleryPhotos } from '@app/_interfaces/locker.interface';
import { GFormFields, GFormOptions } from 'gs-forms';
import { LockerFormOptions, AddGalleryForm } from '@app/_forms/locker.forms';
import { FormGroup } from '@angular/forms';

enum ViewType {
  GALLERY = 'GALLERY',
  DETAIL = 'DETAIL'
}

@Component({
  selector: 'app-locker-gallery',
  templateUrl: './locker-gallery.component.html',
  styleUrls: ['./locker-gallery.component.sass']
})
export class LockerGalleryComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  private galleryId: string;
  public gallery: Array<LockerGallery>;
  public galleryPhotos: Array<LockerGalleryPhotos>;
  public viewContent: ViewType;
  public currentTitle = '';
  public viewType = ViewType;
  public formAddGalleryFields: GFormFields = AddGalleryForm;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.getGallery();
    this.formOptions.context.saveButton.text = 'FORM.ADD_GALLERY';
    this.formOptions.layout.columns = 'auto';
  }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private getGallery() {
    this.loader.start();
    this.lockerService.getLockerGalleryCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(gallery => {
        this.gallery = gallery;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGallery');
        this.loader.stop();
      });
  }

  public getGalleryPhotos(gallery: LockerGallery) {
    this.loader.start();
    this.lockerService.getLockerGalleryDocumentCollection(gallery.id)
      .pipe(takeUntil(this.destroyed$))
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
    this.viewContent = ViewType.GALLERY;
    this.currentTitle = '';
  }

  public onAddNewGallery(form: FormGroup) {
    this.loader.start();
    const galley = {
      id: form.value.name.replace(/ /g, '').toLowerCase(),
      title: form.value.name
    };

    this.lockerService.addLockerGallery(galley)
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

  public onDeleteGallery() { }

  public onAddImage($event: any): void {
    if (!$event.target.files || !$event.target.files[0]) {
      return;
    }

    this.loader.start();
    const file: File = $event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const base64Image = reader.result;
      this.lockerService.addLockerGalleryImage(this.galleryId, base64Image)
        .then(() => this.loader.stop())
        .catch(error => {
          this.loader.stop();
          console.error(error, 'LockerGalleryComponent.onAddImage');
        });
    };
  }

}
