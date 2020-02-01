import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { GsPlayerModule } from 'gs-player';
import { WidgetsModule } from '@app/_widgets/widgets.module';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';
import { BioComponent } from './bio/bio.component';
import { ContactComponent } from './contact/contact.component';
import { DatesComponent } from './dates/dates.component';
import { GalleryComponent } from './gallery/gallery.component';
import { MusicComponent } from './music/music.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'bio',
        component: BioComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'dates',
        component: DatesComponent
      },
      {
        path: 'gallery',
        component: GalleryComponent
      },
      {
        path: 'music',
        component: MusicComponent
      },
      {
        path: 'video',
        component: VideoComponent
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    BioComponent,
    ContactComponent,
    DatesComponent,
    GalleryComponent,
    HomeComponent,
    MusicComponent,
    VideoComponent,
    MainComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    TranslateModule,
    WidgetsModule,
    GsPlayerModule
  ]
})
export class MainModule { }
