import { FroalaEditorModule } from 'angular-froala-wysiwyg';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { gsFormStyles } from '@app/_constants';
import { LockerGuard } from '@app/_guards/locker.guard';
import { AlertModule } from '@app/_widgets/alert';
import { HelperService } from '@app/services/helper.service';
import { GsFormsModule } from '@gs/ng-forms';
import { TranslateModule } from '@ngx-translate/core';
import 'froala-editor/js/plugins.pkgd.min.js';
import { AuthComponent } from './auth/auth.component';
import { LockerBioComponent } from './locker-bio/locker-bio.component';
import { LockerContactComponent } from './locker-contact/locker-contact.component';
import { LockerDatesComponent } from './locker-dates/locker-dates.component';
import { LockerGalleryComponent } from './locker-gallery/locker-gallery.component';
import { LockerGeneralComponent } from './locker-general/locker-general.component';
import { LockerMusicComponent } from './locker-music/locker-music.component';
import { LockerVideoComponent } from './locker-video/locker-video.component';
import { LockerComponent } from './locker.component';
import {LockerBookingComponent} from "@app/modules/locker/locker-booking/locker-booking.component";

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: '',
    component: LockerComponent,
    canActivate: [LockerGuard],
    canActivateChild: [LockerGuard],
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
        path: 'booking',
        component: LockerBookingComponent
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
    LockerBookingComponent,
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
    GsFormsModule.forRoot(gsFormStyles),
    AlertModule
  ],
  providers: [
    HelperService
  ]
})
export class LockerModule { }
