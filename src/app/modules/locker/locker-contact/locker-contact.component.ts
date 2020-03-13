import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { GFormFields, GFormOptions, GsFormsService } from 'gs-forms';
import { LockerService } from '@app/services/locker.service';
import { LockerContactInfo } from '@app/_interfaces/locker.interface';
import { ContactInfoForm, LockerFormOptions } from '@app/_forms/locker.forms';

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
    this.formOptions.context.saveButton.text = 'FORM.SAVE';
    this.formOptions.layout.columns = 'auto';
    this.getContactInfo();
  }

  private setForm(data: LockerContactInfo) {
    this.formFields = this.gsFormService.patchFormValues(ContactInfoForm, data);
    this.loader.stop();
  }

  public getContactInfo() {
    this.loader.start();
    this.lockerService.getLockerContactInfo()
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
    this.lockerService.setLockerContactInfo({
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
