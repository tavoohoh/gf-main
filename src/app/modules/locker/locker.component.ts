import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { HelperService } from '@app/services/helper.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.sass']
})
export class LockerComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
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
    private helperService: HelperService,
    private authService: AuthService,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.currentLang = this.helperService.getCurrentLang();
    this.activeUrl = this.router.url;
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;
      }
    });

    this.fireAuth.user
      .pipe(takeUntil(this.destroyed$))
      .subscribe(user => {
        if (user) {
          this.userEmail = user.email;
          this.authService.setCurrentUser(user.email);
        } else {
          this.navigateAuth();
        }
      }, error => {
        console.error('user is not authenticated', error);
        this.navigateAuth();
      });
  }

  private navigateAuth() {
    this.router.navigate(['admin/auth']);
    this.authService.removeCurrentUser();
  }

  public logout() {
    this.fireAuth.signOut().then(() => {
      this.navigateAuth();
    });
  }

  public toggleLang() {
    this.helperService.toggleLanguage();
  }
}
