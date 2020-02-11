import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TranslateModule } from '@ngx-translate/core';

// modules
import { SharedModule } from '../shared.module';

// components
import { LockerGeneralComponent } from './locker-general/locker-general.component';
import { LockerBioComponent } from './locker-bio/locker-bio.component';
import { LockerContactComponent } from './locker-contact/locker-contact.component';
import { LockerDatesComponent } from './locker-dates/locker-dates.component';
import { LockerGalleryComponent } from './locker-gallery/locker-gallery.component';
import { LockerMusicComponent } from './locker-music/locker-music.component';
import { LockerVideoComponent } from './locker-video/locker-video.component';
import { AuthComponent } from './auth/auth.component';
import { LockerComponent } from './locker.component';
import { HelperService } from '@app/services/helper.service';
import { LockerService } from '@app/services/locker.service';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['admin/auth']);
const redirectLoggedIn = () => redirectLoggedInTo(['admin']);

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedIn }
  },
  {
    path: '',
    component: LockerComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    children: [
      {
        path: '',
        component: LockerGeneralComponent
      },
      {
        path: 'bio',
        component: LockerBioComponent
      },
      {
        path: 'contact',
        component: LockerContactComponent
      },
      {
        path: 'dates',
        component: LockerDatesComponent
      },
      {
        path: 'gallery',
        component: LockerGalleryComponent
      },
      {
        path: 'music',
        component: LockerMusicComponent
      },
      {
        path: 'video',
        component: LockerVideoComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AuthComponent,
    LockerComponent,
    LockerGeneralComponent,
    LockerBioComponent,
    LockerContactComponent,
    LockerDatesComponent,
    LockerGalleryComponent,
    LockerMusicComponent,
    LockerVideoComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    FroalaEditorModule.forRoot(),
    SharedModule
  ],
  providers: [
    HelperService,
    LockerService
  ]
})
export class LockerModule { }
