import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  public coverImage: string;
  public isHome: boolean;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
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
      this.isHome = true;
    } else {
      this.isHome = false;
    }

    this.coverImage = `view-${view}`;
  }
}
