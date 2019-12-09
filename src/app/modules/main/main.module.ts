import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { PlayerModule } from '@app/_widget/player/player.module';

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
    PlayerModule
  ]
})
export class MainModule { }
