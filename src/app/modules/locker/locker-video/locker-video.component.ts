import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GsFormsService, GsFormsComponent, GFormFields, GFormOptions } from 'gs-forms';

import { LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerService } from '@app/services/locker.service';
import { AlertService } from '@app/_widgets/alert';
import { LockerVideo } from '@app/_interfaces';
import { ViewType } from '@app/_enums';

@Component({
  selector: 'app-locker-video',
  templateUrl: './locker-video.component.html',
  styleUrls: [
    './locker-video.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerVideoComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public viewContent: ViewType;
  public viewType = ViewType;

  public videosCollection: Array<LockerVideo>;
  public video: LockerVideo;

  public formFields: GFormFields;
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
    this.listVideos();
  }

  private listVideos(): void {}

  public readVideo(videoId: string): void {}

  public writeVideo(form: FormGroup): void {}

  public deleteVideo(): void {}

  public openAlert(alertId: string): void {}

  public closeAlert(alertId: string): void {}

  public updateView(viewType: ViewType): void {
    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }

    this.viewContent = viewType;
  }
}
