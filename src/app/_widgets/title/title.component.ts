import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-title',
  template: `
    <div class="view-title page-container" *ngIf="activeUrl && activeUrl !== 'gallery'">
      <h2>{{ title | translate }}</h2>
    </div>
  `,
  styleUrls: ['./title.component.sass']
})
export class TitleComponent implements OnInit {
  public showMenu: boolean;
  public activeUrl: string;
  public title: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.setTemplateVariables(this.router.url.replace('/', ''));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setTemplateVariables(event.url.replace('/', ''));
      }
    });
  }

  private setTemplateVariables(url: string) {
    this.activeUrl = url;
    this.title = `NAVIGATION.${url.toUpperCase()}`;
  }

}
