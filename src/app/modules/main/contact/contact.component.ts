import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { LockerService } from '@app/services/locker.service';
import { LockerContactInfo, LockerPhoneModel } from '@app/_interfaces/locker.interface';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.sass']
})
export class ContactComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public contactInfo: {
    usaEmail: string,
    venEmail: string,
    usaPhone: { text: string, link: string }
    venPhone: { text: string, link: string }
  };

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

  public getContactInfo() {
    this.loader.start();
    this.lockerService.getLockerContactInfo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(contactInfo => {
        this.setViewData(contactInfo);
      }, error => {
        console.error(error, 'ContactComponent.getContactInfo');
        this.loader.stop();
      });
  }
}
