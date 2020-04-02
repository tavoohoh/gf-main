import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { LockerFormOptions, VideoForm } from '@app/_forms/locker.forms';
import { LockerVideo } from '@app/_interfaces';
import { AlertService } from '@app/_widgets/alert';
import { LockerService } from '@app/services/locker.service';
import { GFormFields, GFormOptions, GsFormsComponent, GsFormsService } from 'gs-forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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

    this.formFields = null;
    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }

    this.lockerService.readVideoDocument(videoId)
      .pipe(take(1))
      .toPromise()
      .then(video => {
        this.viewContent = ViewType.DETAIL;
        this.video = video;
        this.video.id = videoId;
        this.formFields = this.gsFormService.patchFormValues(VideoForm, video);
      })
      .catch(error => console.error(error, 'LockerVideoComponent.readVideo'))
      .finally(() => this.loader.stop());
  }

  public writeVideo(form: FormGroup): void {
    this.loader.start();
    this.lockerService[this.video ? 'updateVideoDocument' : 'createVideoDocument']({
      video: {
        title: form.value.title,
        url: form.value.url,
        position: form.value.position
      },
      id: this.video ? this.video.id : null
    })
      .then(() => {
        this.viewContent = null;
        this.video = null;
      })
      .catch(error => console.error(error, 'LockerVideoComponent.writeVideo'))
      .finally(() => this.loader.stop());
  }

  public deleteVideo(): void {
    this.loader.start();
    this.lockerService.deleteVideoDocument(this.video.id)
      .then(() => {
        this.viewContent = null;
        this.video = null;
        this.closeAlert('deleteVideoAlert');
      })
      .catch(error => console.error(error, 'LockerVideoComponent.deleteDate'))
      .finally(() => this.loader.stop());
  }

  public openAlert(alertId: string): void {
    this.alertService.open(alertId);
  }

  public closeAlert(alertId: string): void {
    this.alertService.close(alertId);
  }

  public showEmptyForm(): void {
    this.loader.start();
    this.viewContent = ViewType.ADD;
    this.video = null;

    setTimeout(() => {
      if (this.formComponent) {
        this.formComponent.formActions('reset');
      }
      this.loader.stop();
    }, 500);
  }
}
