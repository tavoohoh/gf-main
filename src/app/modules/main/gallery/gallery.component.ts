import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResourcesLinks } from '@app/_enums';
import { LockerGallery, LockerGalleryPhotos } from '@app/_interfaces';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface ImageDisplayedType {
  gallery: Array<LockerGalleryPhotos>;
  position: number;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass']
})
export class GalleryComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public resourcesLinks = ResourcesLinks;
  public galleries: Array<{ title: string, images: Array<LockerGalleryPhotos> }> = [];
  public imageDisplayed: ImageDisplayedType;

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

  private getGalleryCollections(): void {
    this.loader.start();
    this.lockerService.listGalleryCollection()
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

  public getGalleryPhotos(gallery: LockerGallery): void {
    this.loader.start();
    this.lockerService.getGalleryDocument(gallery.id)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(images => {

        this.galleries.push({
          title: gallery.title,
          images
        });

        this.loader.stop();
      }, error => {
        console.error(error, 'LockerGalleryComponent.getGalleryPhotos');
        this.loader.stop();
      });
  }

  public openImage(imageDisplayed: ImageDisplayedType): void {
    this.imageDisplayed = imageDisplayed;
  }

  public nextImage(): void {
    if (!this.imageDisplayed.gallery[this.imageDisplayed.position + 1].src) {
      return;
    }

    this.imageDisplayed.position = ++this.imageDisplayed.position;
  }

  public previousImage(): void {
    if (!this.imageDisplayed.gallery[this.imageDisplayed.position - 1].src) {
      return;
    }

    this.imageDisplayed.position = --this.imageDisplayed.position;
  }

  public closeImage(): void {
    this.imageDisplayed = null;
  }
}
