import { Component, OnInit } from '@angular/core';
import { AudioService } from '@app/services/audio.service';
import { PlayerConfig, PlayerFile, PlayerTheme } from 'gs-player';

@Component({
  selector: 'app-player',
  template: `
    <gs-player
      [files]="files"
      [playerTheme]="playerTheme"
      [playerConfig]="playerConfig">
    </gs-player>
  `
})
export class PlayerComponent implements OnInit {
  public coverImage: string;

  /* player variables */
  public files: Array<PlayerFile>;
  public playerTheme: PlayerTheme = {
    primary: '#fcf9f8',
    secondary: '#999999'
  };
  public playerConfig: PlayerConfig = {
    artistAlbumSeparator: '-'
  };

  constructor(
    private audioService: AudioService
  ) { }

  ngOnInit() {
    this.audioService.getFiles().subscribe(files => {
      this.files = files;
    });
  }

}
