import { Component, OnDestroy, OnInit } from '@angular/core';
import { ResourcesLinks } from '@app/_enums/index';
import { LockerVideo } from '@app/_interfaces';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.sass']
})
export class VideoComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public videos: Array<LockerVideo>;
  public resourcesLinks = ResourcesLinks;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getVideos();
  }

  private getVideos(): void {
    this.loader.start();
    this.lockerService.listVideosCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(videosCollection => {
        this.videos = videosCollection;
        console.log(videosCollection)
        this.loader.stop();
      }, error => {
        console.error(error, 'VideoComponent.getVideos');
        this.loader.stop();
      });
  }
}
