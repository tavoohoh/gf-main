import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { GsPlayerModule } from 'gs-player';
import { WidgetsModule } from '@app/_widgets/widgets.module';

import { MainComponent } from './main.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      }
    ]
  },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
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
