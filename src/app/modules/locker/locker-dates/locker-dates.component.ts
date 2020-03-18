import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { LockerService } from '@app/services/locker.service';
import { AlertService } from '@app/_widgets/alert';
import { GFormFields, GFormOptions, GsFormsService, GsFormsComponent } from 'gs-forms';
import { DateForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { takeUntil } from 'rxjs/operators';
import { LockerDate } from '@app/_interfaces';
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
  public viewContent: ViewType;
  public viewType = ViewType;

  public dateCollections: Array<LockerDate>;
  public date: LockerDate;

  public formFields: GFormFields = DateForm;
  public formOptions: GFormOptions = LockerFormOptions;

  @ViewChild(GsFormsComponent, { static: false }) formComponent: GsFormsComponent;

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
    this.listDates();
  }

  private listDates(): void {
    this.loader.start();
    this.lockerService.listLockerDatesCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(dateCollections => {
        this.dateCollections = dateCollections;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerDatesComponent.listDates');
        this.loader.stop();
      });
  }

  public readDate(dateId: string): void {
    this.loader.start();
    this.viewContent = null;

    this.lockerService.readLockerDateDocument(dateId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(date => {
        this.updateView(ViewType.DETAIL);
        this.date = date;
        this.date.id = dateId;
        this.formFields = this.gsFormService.patchFormValues(DateForm, date);
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerDatesComponent.readDate');
        this.loader.stop();
      });
  }

  public writeDate(form: FormGroup): void {
    this.loader.start();

    this.lockerService[this.date ? 'updateLockerDateDocument' : 'createLockerDateDocument']({
      date: {
        title: form.value.title,
        location: form.value.location,
        date: form.value.date,
        published: form.value.published
      },
      id: this.date ? this.date.id : null
    }).then(() => {
      this.updateView(null);
      this.loader.stop();
    }, error => {
      console.error(error, 'LockerDatesComponent.writeDate');
      this.loader.stop();
    });
  }

  public deleteDate(): void {
    this.loader.start();
    this.lockerService.deleteLockerDateDocument(this.date.id)
      .then(() => {
        this.updateView(null);
        this.closeAlert('deleteDateAlert');
        this.loader.stop();
      })
      .catch(error => {
        console.error(error, 'LockerDatesComponent.deleteDate');
        this.loader.stop();
      });
  }

  public openAlert(id: string): void {
    this.alertService.open(id);
  }

  public closeAlert(id: string): void {
    this.alertService.close(id);
  }

  public updateView(viewType: ViewType): void {
    this.viewContent = viewType;
    this.date = null;

    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }
  }

}
