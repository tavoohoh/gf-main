import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { LockerService } from '@app/services/locker.service';
import { AlertService } from '@app/_widgets/alert';
import { GFormFields, GFormOptions, GsFormsService, GsFormsComponent } from 'gs-forms';
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
  @ViewChild(GsFormsComponent, { static: false }) formComponent: GsFormsComponent;
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
    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }

    this.currentDate = null;
    this.formOptions.context.saveButton.text = 'FORM.ADD';
    this.viewContent = ViewType.ADD;
  }

  public viewDate(dateId: string): void {
    this.loader.start();
    this.viewContent = null;

    this.lockerService.readLockerDateDocument(dateId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(currentDate => {
        this.formFields = this.gsFormService.patchFormValues(DateForm, currentDate);
        this.currentDate = currentDate;
        this.currentDate.id = dateId;
        this.viewContent = ViewType.DETAIL;
        this.formOptions.context.saveButton.text = 'FORM.SAVE';
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerDatesComponent.viewDate');
        this.loader.stop();
      });
  }

  public setDate(form: FormGroup): void {
    this.loader.start();

    this.lockerService[this.currentDate ? 'updateLockerDateDocument' : 'createLockerDateDocument']({
      date: {
        title: form.value.title,
        location: form.value.location,
        date: form.value.date,
        published: form.value.published
      },
      dateId: this.currentDate ? this.currentDate.id : null
    }).then(() => {
      this.viewContent = null;
      this.currentDate = null;
      this.formComponent.formActions('reset');
      this.loader.stop();
    }, error => {
      console.error(error, 'LockerDatesComponent.setDate');
      this.loader.stop();
    });
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

  public openAlert(id: string): void {
    this.alertService.open(id);
  }

  public closeAlert(id: string): void {
    this.alertService.close(id);
  }

  public deleteDate(): void {
    this.loader.start();
    this.lockerService.deleteLockerDateDocument(this.currentDate.id)
      .then(() => {
        this.viewContent = null;
        this.currentDate = null;
        this.loader.stop();
        this.closeAlert('deleteDateAlert');
      })
      .catch(error => {
        console.error(error, 'LockerDatesComponent.deleteDate');
        this.loader.stop();
      });
  }

}
