import { FroalaViewModule } from 'angular-froala-wysiwyg';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetsModule } from '@app/_widgets/widgets.module';
import { TranslateModule } from '@ngx-translate/core';
import { BioComponent } from './bio/bio.component';
import { ContactComponent } from './contact/contact.component';
import { DatesComponent } from './dates/dates.component';
import { GalleryComponent } from './gallery/gallery.component';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main.component';
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
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    FroalaViewModule.forRoot(),
    WidgetsModule
  ]
})
export class MainModule { }
