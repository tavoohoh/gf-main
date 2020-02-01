import { Component, OnInit } from '@angular/core';
import { PlayerFile, PlayerTheme, PlayerConfig } from 'gs-player';
import { AudioService } from '@app/services/audio.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
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
    private audioService: AudioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.audioService.getFiles().subscribe(files => {
      this.files = files;
    });
    this.subscribeToNavigationEnd();
  }

  private subscribeToNavigationEnd() {
    this.setCoverImage(this.router.url.split('/').reverse()[0]);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setCoverImage(event.url.split('/').reverse()[0]);
      }
    });
  }

  private setCoverImage(view: string) {
    if (view === '') {
      view = 'home';
    }

    this.coverImage = `url(./assets/cover/${view}.jpg)`;
  }
}
