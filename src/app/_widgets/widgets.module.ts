import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { GsPlayerModule } from 'gs-player';

import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { PlayerComponent } from './player/player.component';
import { TitleComponent } from './title/title.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    NavigationComponent,
    FooterComponent,
    PlayerComponent,
    TitleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    GsPlayerModule
  ],
  exports: [
    NavigationComponent,
    FooterComponent,
    PlayerComponent,
    TitleComponent
  ]
})
export class WidgetsModule { }
