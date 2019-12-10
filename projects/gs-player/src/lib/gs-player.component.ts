import { Component, OnInit } from '@angular/core';
import { GsPlayerService } from './gs-player.service';


@Component({
  selector: 'lib-gs-player',
  templateUrl: './gs-player.component.html',
  styleUrls: ['./gs-player.component.sass']
})
export class GsPlayerComponent implements OnInit {
  public files: Array<any> = [];
  public state;
  public currentFile: any = {};

  constructor(
    public playerService: GsPlayerService
  ) { }

  ngOnInit() {
    // get media files
    // this.musicService.getFiles().subscribe(files => {
    //   this.files = files;
    // });

    // listen to stream state
    this.playerService.getState().subscribe(state => {
      this.state = state;
    });
  }

  playStream(url) {
    this.playerService.playStream(url).subscribe(events => {
      // listening for fun here
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.playerService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.playerService.pause();
  }

  play() {
    this.playerService.play();
  }

  stop() {
    this.playerService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  onSliderChangeEnd(change) {
    this.playerService.seekTo(change.value);
  }
}

