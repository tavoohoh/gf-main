import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

import { LockerService } from '@app/services/locker.service';
import { AlertService } from '@app/_widgets/alert';
import { GFormFields, GFormOptions } from 'gs-forms';
import { DateForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { takeUntil } from 'rxjs/operators';
import { LockerDate } from '@app/_interfaces/locker.interface';

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
  public currentDate: string;

  public formAddGalleryFields: GFormFields = DateForm;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService,
    private alertService: AlertService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getDates();
  }

  public addNewDate(): void {}

  private getDates(): void {
    this.loader.start();
    this.lockerService.getLockerDatesCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(dateCollections => {
        this.dateCollections = dateCollections;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerDatesComponent.getDates');
        this.loader.stop();
      });
  }

  public getDate(dateId: string): void {}
}
