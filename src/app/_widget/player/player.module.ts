import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerComponent } from '@app/_widget/player/player.component';
import { MaterialModule } from '@app/_shared/material.module';

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
