import { Component, OnInit } from '@angular/core';

import { PlayerFile, PlayerTheme, PlayerThemeDark, PlayerConfig, PlayerThemeLight } from 'gs-player';
import { AudioService } from '@app/services/audio.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  public files: Array<PlayerFile>;
  public playerTheme: PlayerTheme = {
    primary: 'red',
    secondary: 'blue'
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
