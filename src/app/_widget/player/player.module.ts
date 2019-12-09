import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '@app/_widget/player/player.component';
import { MaterialModule } from '@app/_shared/material.module';

// https://auth0.com/blog/building-an-audio-player-app-with-angular-and-rxjs/

@NgModule({
  declarations: [
    PlayerComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    PlayerComponent
  ]
})
export class PlayerModule { }
