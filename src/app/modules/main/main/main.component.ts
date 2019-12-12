import { Component, OnInit } from '@angular/core';
import { PlayerFile, PlayerTheme, PlayerThemeLight } from 'gs-player';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  public files: Array<PlayerFile>;
  public playerTheme: PlayerTheme = PlayerThemeLight;

  constructor() { }

  ngOnInit() {
  }

}
