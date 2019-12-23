import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

import { GsPlayerModule } from 'gs-player';
import { WidgetsModule } from '@app/_widgets/widgets.module';

const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    WidgetsModule,
    GsPlayerModule
  ]
})
export class MainModule { }
