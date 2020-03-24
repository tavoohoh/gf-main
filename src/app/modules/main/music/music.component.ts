import { Component, OnDestroy, OnInit } from '@angular/core';
import { LockerMusic } from '@app/_interfaces';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.sass']
})
export class MusicComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public music: Array<LockerMusic>;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getMusic();
  }

  private getMusic(): void {
    this.loader.start();
    this.lockerService.listMusicCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(musicCollection => {
        console.log(musicCollection);
        this.music = musicCollection;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerMusicComponent.listMusic');
        this.loader.stop();
      });
  }

}
