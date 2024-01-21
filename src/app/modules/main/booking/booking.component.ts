import { Component, OnDestroy, OnInit } from '@angular/core';
import { LockerContactInfo, LockerGalleryPhoto, LockerPhoneModel } from '@app/_interfaces/locker.interface';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

interface ImageDisplayedType {
  gallery: Array<LockerGalleryPhoto>;
  position: number;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.sass']
})
export class BookingComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public contactInfo: {
    usaEmail: string,
    venEmail: string,
    usaPhone: { text: string, link: string }
    venPhone: { text: string, link: string }
  };
  public sections: Array<{
    title: string;
    content: string;
    type: 'TEXT' | 'VIDEO' | 'GALLERY';
    position: number;
    urls?: string | string[];
  }>;
  public imageDisplayed: ImageDisplayedType;

  constructor(
    private loader: NgxUiLoaderService,
    private lockerService: LockerService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getContactInfo();
    this.getBookingInfo();
  }

  private maskPhoneNumber(val: LockerPhoneModel): string {
    return `+${val.code} ${val.phone.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3')}`;
  }

  private setViewData(contactInfo: LockerContactInfo) {
    this.contactInfo = {
      usaEmail: contactInfo.usaEmail,
      venEmail: contactInfo.venEmail,
      usaPhone: {
        link: `+${contactInfo.usaPhone.code}${contactInfo.usaPhone.phone}`,
        text: this.maskPhoneNumber(contactInfo.usaPhone)
      },
      venPhone: {
        link: `+${contactInfo.venPhone.code}${contactInfo.venPhone.phone}`,
        text: this.maskPhoneNumber(contactInfo.venPhone)
      },
    };

    this.loader.stop();
  }

  private getContactInfo() {
    this.loader.start();
    this.lockerService.readContactInfo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(contactInfo => {
        this.setViewData(contactInfo);
      }, error => {
        console.error(error, 'BookingComponent.getContactInfo');
        this.loader.stop();
      });
  }

  private getBookingInfo() {
    this.lockerService.listBookingSectionCollection()
      .pipe(take(1), takeUntil(this.destroyed$))
      .subscribe(sectionCollections => {
        this.sections = sectionCollections;
        this.loader.stop();
      }, error => {
        this.loader.stop();
      });
  }

  public openImage(imageDisplayed: ImageDisplayedType): void {
    this.imageDisplayed = imageDisplayed;
  }

  public nextImage(): void {
    if (!this.imageDisplayed.gallery[this.imageDisplayed.position + 1]) {
      return;
    }

    this.imageDisplayed.position = ++this.imageDisplayed.position;
  }

  public previousImage(): void {
    if (!this.imageDisplayed.gallery[this.imageDisplayed.position - 1]) {
      return;
    }

    this.imageDisplayed.position = --this.imageDisplayed.position;
  }

  public closeImage(): void {
    this.imageDisplayed = null;
  }
}

