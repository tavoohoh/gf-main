import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GsFormsService, GsFormsComponent, GFormFields, GFormOptions } from 'gs-forms';
import { takeUntil } from 'rxjs/operators';

import { LockerFormOptions, VideoForm } from '@app/_forms/locker.forms';
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

  public formFields: GFormFields = VideoForm;
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

  private listVideos(): void {
    this.loader.start();
    this.lockerService.listVideosCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(videosCollection => {
        this.videosCollection = videosCollection;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerVideoComponent.listVideos');
        this.loader.stop();
      });
  }

  public readVideo(videoId: string): void {
    this.loader.start();
    this.viewContent = null;

    this.lockerService.readVideoDocument(videoId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(video => {
        this.updateView(ViewType.DETAIL);
        this.video = video;
        this.video.id = videoId;
        this.formFields = this.gsFormService.patchFormValues(VideoForm, video);
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerVideoComponent.readVideo');
        this.loader.stop();
      });
  }

  public writeVideo(form: FormGroup): void {
    this.loader.start();

    this.lockerService[this.video ? 'updateVideoDocument' : 'createVideoDocument']({
      video: {
        title: form.value.title,
        url: form.value.location
      },
      id: this.video ? this.video.id : null
    }).then(() => {
      this.updateView(null);
      this.loader.stop();
    }, error => {
      console.error(error, 'LockerVideoComponent.writeVideo');
      this.loader.stop();
    });
  }

  public deleteVideo(): void {
    this.loader.start();
    this.lockerService.deleteVideoDocument(this.video.id)
      .then(() => {
        this.updateView(null);
        this.closeAlert('deleteDateAlert');
        this.loader.stop();
      })
      .catch(error => {
        console.error(error, 'LockerVideoComponent.deleteDate');
        this.loader.stop();
      });
  }

  public openAlert(alertId: string): void {
    this.alertService.open(alertId);
  }

  public closeAlert(alertId: string): void {
    this.alertService.close(alertId);
  }

  public updateView(viewType: ViewType): void {
    this.viewContent = viewType;
    this.video = null;

    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }
  }
}
