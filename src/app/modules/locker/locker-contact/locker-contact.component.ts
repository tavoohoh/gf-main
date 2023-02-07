import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ContactInfoForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerContactInfo } from '@app/_interfaces/locker.interface';
import { LockerService } from '@app/services/locker.service';
import { GFormFields, GFormOptions, GsFormsService } from '@gs/ng-forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-locker-contact',
  templateUrl: './locker-contact.component.html',
  styleUrls: [
    './locker-contact.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerContactComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public formFields: GFormFields;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private loader: NgxUiLoaderService,
    private lockerService: LockerService,
    private gsFormService: GsFormsService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getContactInfo();
  }

  private setForm(data: LockerContactInfo): void {
    const values: any = data;
    values.usaPhone = data.usaPhone.phone;

    this.formFields = this.gsFormService.patchFormValues(ContactInfoForm, data);
    this.loader.stop();
  }

  public getContactInfo(): void {
    this.loader.start();
    this.lockerService.readContactInfo()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(contactInfo => {
        this.setForm(contactInfo);
      }, error => {
        console.error(error, 'LockerContactComponent.getContactInfo');
        this.loader.stop();
      });
  }

  public setContactInfo(form: FormGroup): void {
    this.loader.start();
    this.lockerService.updateContactInfo({
      usaEmail: form.value.usaEmail,
      usaPhone: form.value.usaPhone,
      venEmail: form.value.venEmail,
      venPhone: form.value.venPhone
    }).then(() => {
      this.loader.stop();
    }, error => {
      console.error(error, 'LockerContactComponent.setContactInfo');
      this.loader.stop();
    });
  }

}
