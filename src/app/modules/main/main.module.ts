import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { GsPlayerModule } from 'projects/gs-player/src/public-api';

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
    GsPlayerModule
  ]
})
export class MainModule { }
