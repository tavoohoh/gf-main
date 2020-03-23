import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { DateForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerDate } from '@app/_interfaces';
import { AlertService } from '@app/_widgets/alert';
import { LockerService } from '@app/services/locker.service';
import { GFormFields, GFormOptions, GsFormsComponent, GsFormsService } from 'gs-forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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

  public async readDate(dateId: string): Promise<void> {
    this.loader.start();

    await this.lockerService.readLockerDateDocument(dateId)
      .pipe(take(1))
      .toPromise()
      .then(date => {
        this.viewContent = ViewType.DETAIL;
        this.date = date;
        this.date.id = dateId;
        this.formFields = this.gsFormService.patchFormValues(DateForm, date);
      })
      .catch(error => console.error(error, 'LockerDatesComponent.readDate'))
      .finally(() => this.loader.stop());
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
    })
      .then(() => {
        this.viewContent = null;
        this.date = null;
      })
      .catch(error => console.error(error, 'LockerDatesComponent.writeVideo'))
      .finally(() => this.loader.stop());
  }

  public deleteDate(): void {
    this.loader.start();
    this.lockerService.deleteLockerDateDocument(this.date.id)
      .then(() => {
        this.viewContent = null;
        this.date = null;
        this.closeAlert('deleteDateAlert');
      })
      .catch(error => console.error(error, 'LockerDatesComponent.deleteDate'))
      .finally(() => this.loader.stop());
  }

  public openAlert(id: string): void {
    this.alertService.open(id);
  }

  public closeAlert(id: string): void {
    this.alertService.close(id);
  }

  public showEmptyForm(): void {
    this.loader.start();
    this.viewContent = ViewType.ADD;
    this.date = null;

    setTimeout(() => {
      if (this.formComponent) {
        this.formComponent.formActions('reset');
      }
      this.loader.stop();
    }, 500);
  }

}
