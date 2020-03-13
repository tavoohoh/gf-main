import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from '@app/services/helper.service';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.sass']
})
export class LockerComponent implements OnInit {
  public pages: Array<{ url: string; name: string; }> = [
    // {
    //   url: '/admin',
    //   name: 'NAVIGATION.GENERAL'
    // },
    {
      url: '/admin/bio',
      name: 'NAVIGATION.BIO'
    },
    {
      url: '/admin/contact',
      name: 'NAVIGATION.CONTACT'
    },
    {
      url: '/admin/dates',
      name: 'NAVIGATION.DATES'
    },
    {
      url: '/admin/gallery',
      name: 'NAVIGATION.GALLERY'
    },
    {
      url: '/admin/music',
      name: 'NAVIGATION.MUSIC'
    },
    {
      url: '/admin/video',
      name: 'NAVIGATION.VIDEO'
    }
  ];
  public activeUrl: string;
  public userEmail: string;
  public currentLang: string;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private helperService: HelperService
  ) { }

  ngOnInit() {
    this.currentLang = this.helperService.getCurrentLang();
    this.activeUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;
      }
    });

    this.fireAuth.user.subscribe(user => {
      this.userEmail = user.email;
    });
  }

  public logout() {
    this.fireAuth.signOut().then(() => this.router.navigate(['admin/auth']));
  }

  public toggleLang() {
    this.helperService.toggleLanguage();
  }
}
