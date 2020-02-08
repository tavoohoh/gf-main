import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-locker',
  templateUrl: './locker.component.html',
  styleUrls: ['./locker.component.sass']
})
export class LockerComponent implements OnInit {
  public pages: Array<{ url: string; name: string; }> = [
    {
      url: '/admin',
      name: 'general'
    },
    {
      url: '/admin/bio',
      name: 'bio'
    },
    {
      url: '/admin/contact',
      name: 'contact'
    },
    {
      url: '/admin/dates',
      name: 'dates'
    },
    {
      url: '/admin/gallery',
      name: 'gallery'
    },
    {
      url: '/admin/music',
      name: 'music'
    },
    {
      url: '/admin/video',
      name: 'video'
    }
  ];
  public activeUrl: string;
  public userEmail: string;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {
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
}
