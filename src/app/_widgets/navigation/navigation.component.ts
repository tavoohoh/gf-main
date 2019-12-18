import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { NAVIGATION } from '@app/_constants';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  public navigation = NAVIGATION;
  public showMenu: boolean;
  public activeUrl: string;

  constructor(
    private router: Router
  ) {}

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;
      }
    });
  }

  public onHideMenu() {
    this.showMenu = false;
  }
}
