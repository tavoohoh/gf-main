import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    const userLanguage = window.localStorage.getItem('userLanguage') || 'en';
    this.translate.setDefaultLang(userLanguage);
    this.translate.use(userLanguage);
  }
}
