import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GsFormsModule } from 'gs-forms';
import { GsTablesModule } from 'gs-tables';
import { gsFormStyles, gsTablesStyles } from '@app/_constants';

@NgModule({
  imports: [
    CommonModule,
    GsFormsModule.forRoot(gsFormStyles),
    GsTablesModule.forRoot(gsTablesStyles)
  ],
  exports: [
    GsFormsModule,
    GsTablesModule
  ]
})
export class SharedModule { }
