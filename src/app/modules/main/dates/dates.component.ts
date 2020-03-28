import { Component, OnDestroy, OnInit } from '@angular/core';
import { LockerDate } from '@app/_interfaces';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dates',
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.sass']
})
export class DatesComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public dates: Array<LockerDate>;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getDates();
  }

  private getDates(): void {
    this.loader.start();
    this.lockerService.listDatesCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(datesCollection => {
        this.dates = datesCollection;
        this.loader.stop();
      }, error => {
        console.error(error, 'DatesComponent.getDates');
        this.loader.stop();
      });
  }
}
