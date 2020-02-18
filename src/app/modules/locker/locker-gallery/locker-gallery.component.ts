import { Component, OnInit, OnDestroy } from '@angular/core';
import { GTable, GTableRowAction } from 'gs-tables';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LockerGallery, LockerGalleryPhotos } from '@app/_interfaces/locker.interface';

enum ViewType {
  GALLERY = 'GALLERY',
  DETAIL = 'DETAIL',
  PHOTO = 'PHOTO'
}

@Component({
  selector: 'app-locker-gallery',
  templateUrl: './locker-gallery.component.html',
  styleUrls: ['./locker-gallery.component.sass']
})
export class LockerGalleryComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public gallery: Array<LockerGallery>;
  public galleryPhotos: Array<LockerGalleryPhotos>;
  public viewContent: ViewType;
  public viewType = ViewType;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.getGallery();
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
        console.log(gallery);
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGallery');
        this.loader.stop();
      });
  }

  public getGalleryPhotos(galleryId: string) {
    this.loader.start();
    this.lockerService.getLockerGalleryDocumentCollection(galleryId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(galleryDocuments => {
        console.log(galleryDocuments);
        this.viewContent = ViewType.DETAIL;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGalleryPhotos');
        this.loader.stop();
      });
  }

  public addNewGallery() {
    this.viewContent = ViewType.GALLERY;
    console.log(this.viewContent, 'should be add gallery');
  }

  public onAddNewGallery() {}

  public onDeleteGallery() {}

  public addNewGalleryPhoto() {
    this.viewContent = ViewType.PHOTO;
  }

  public onAddNewGalleryPhoto() {}

}
