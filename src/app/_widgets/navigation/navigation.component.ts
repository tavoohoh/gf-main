import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
  public isHome: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.activeUrl = this.router.url;
    this.isHomeView(this.router.url.split('/').reverse()[0]);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;

        this.isHomeView(event.url.split('/').reverse()[0]);
      }
    });
  }

  private isHomeView(view: string) {
    if (view === '') {
      this.isHome = true;
    } else {
      this.isHome = false;
    }
  }

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  public hideMenu() {
    this.showMenu = false;
  }

}
