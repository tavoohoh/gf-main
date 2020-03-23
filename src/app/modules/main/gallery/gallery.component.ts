import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { takeUntil } from 'rxjs/operators';
import { LockerGallery, LockerGalleryPhotos } from '@app/_interfaces';
import { ResourcesLinks } from '@app/_enums';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public resourcesLinks = ResourcesLinks;
  public galleries: Array<{ title: string, images: Array<LockerGalleryPhotos> }> = [];
  public imageDisplayed: string;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
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
      .pipe(takeUntil(this.destroyed$))
      .subscribe(galleryCollections => {

        galleryCollections.forEach(gallery => {
          this.getGalleryPhotos(gallery);
        });

        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGallery');
        this.loader.stop();
      });
  }

  public getGalleryPhotos(gallery: LockerGallery) {
    this.loader.start();
    this.lockerService.getLockerGalleryDocument(gallery.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(images => {

        this.galleries.push({
          title: gallery.title,
          images
        });

        console.log('gallery', this.galleries);
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGalleryPhotos');
        this.loader.stop();
      });
  }

  public openImage(imageSrc: string) {
    this.imageDisplayed = imageSrc;
  }

  public closeImage() {
    this.imageDisplayed = null;
  }
}
