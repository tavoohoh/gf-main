import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NavigationComponent,
    FooterComponent
  ]
})
export class WidgetsModule { }
