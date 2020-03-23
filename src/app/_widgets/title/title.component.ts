import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-title',
  template: `
    <div class="view-title" *ngIf="activeUrl && activeUrl !== 'gallery'">
      <h2>{{ activeUrl | translate }}</h2>
    </div>
  `,
  styleUrls: ['./title.component.sass']
})
export class TitleComponent implements OnInit {
  public showMenu: boolean;
  public activeUrl: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.activeUrl = this.router.url.replace('/', '');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url.replace('/', '');
      }
    });
  }

}
