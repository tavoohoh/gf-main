import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { NAVIGATION } from '@app/_constants';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from '@app/services/helper.service';

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
    private translateService: TranslateService,
    private router: Router,
    private helperService: HelperService
  ) { }

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

  public toggleLanguage() {
    this.helperService.toggleLanguage();
  }
}
