import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsFormsModule } from 'gs-forms';
import { gsFormStyles } from '@app/_constants';

@NgModule({
  imports: [
    CommonModule,
    GsFormsModule.forRoot(gsFormStyles)
  ],
  exports: [
    GsFormsModule
  ]
})
export class SharedModule { }
