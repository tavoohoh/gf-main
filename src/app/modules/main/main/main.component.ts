import { Component, OnInit } from '@angular/core';

import { PlayerFile, PlayerTheme, PlayerConfig } from 'gs-player';
import { AudioService } from '@app/services/audio.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
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
