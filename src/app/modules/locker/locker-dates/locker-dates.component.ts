import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { LockerService } from '@app/services/locker.service';
import { AlertService } from '@app/_widgets/alert';
import { GFormFields, GFormOptions, GsFormsService } from 'gs-forms';
import { DateForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { takeUntil } from 'rxjs/operators';
import { LockerDate } from '@app/_interfaces/locker.interface';
import { ViewType } from '@app/_enums';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-locker-dates',
  templateUrl: './locker-dates.component.html',
  styleUrls: [
    './locker-dates.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerDatesComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public dateCollections: Array<LockerDate>;
  public currentDate: LockerDate;
  public viewContent: ViewType;
  public viewType = ViewType;
  public dateId: string;
  public formFields: GFormFields = DateForm;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService,
    private gsFormService: GsFormsService,
    private alertService: AlertService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getDates();
  }

  public addNewDate(): void {
    this.viewContent = ViewType.ADD;
    this.gsFormService.resetForm();
    this.currentDate = null;
    this.formOptions.context.saveButton.text = 'FORM.ADD';
  }

  public viewDate(dateId: string): void {
    this.loader.start();
    this.viewContent = null;
    this.gsFormService.resetForm();

    this.lockerService.readLockerDateDocument(dateId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(currentDate => {
        this.currentDate = currentDate;
        this.currentDate.id = dateId;
        this.formOptions.context.saveButton.text = 'FORM.SAVE';
        this.viewContent = ViewType.DETAIL;
        this.formFields = null;
        this.formFields = this.gsFormService.patchFormValues(DateForm, currentDate);
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerDatesComponent.viewDate');
        this.loader.stop();
      });
  }

  public setDate(form: FormGroup): void {
    console.log(form);
  }

  private getDates(): void {
    this.loader.start();
    this.lockerService.listLockerDatesCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(dateCollections => {
        this.dateCollections = dateCollections;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerDatesComponent.getDates');
        this.loader.stop();
      });
  }

}
