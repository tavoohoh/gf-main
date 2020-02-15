import { Component, OnInit, OnDestroy } from '@angular/core';
import { GTable, GTableRowAction } from 'gs-tables';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LockerGallery, LockerGalleryPhotos } from '@app/_interfaces/locker.interface';

@Component({
  selector: 'app-locker-gallery',
  templateUrl: './locker-gallery.component.html',
  styleUrls: ['./locker-gallery.component.sass']
})
export class LockerGalleryComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public gallery: Array<LockerGallery>;
  public galleryPhotos: Array<LockerGalleryPhotos>;

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

  public getGalleryDocuments(galleryId: string) {
    this.loader.start();
    this.lockerService.getLockerGalleryDocumentCollection(galleryId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(galleryDocuments => {
        console.log(galleryDocuments);
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGalleryDocuments');
        this.loader.stop();
      });
  }

}
