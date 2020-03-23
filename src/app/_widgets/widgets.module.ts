import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GsPlayerModule } from 'gs-player';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PlayerComponent } from './player/player.component';
import { TitleComponent } from './title/title.component';

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
