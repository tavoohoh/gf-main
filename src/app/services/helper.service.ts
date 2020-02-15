import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(
    private translateService: TranslateService,
    private router: Router
  ) { }

  public getCurrentLang(): string {
    return this.translateService.getDefaultLang();
  }

  public toggleLanguage() {
    let userLanguage = window.localStorage.getItem('userLanguage');

    if (userLanguage === 'en') {
      userLanguage = 'es';
    } else {
      userLanguage = 'en';
    }

    this.translateService.use(userLanguage);
    window.localStorage.setItem('userLanguage', userLanguage);
    window.location.reload();
  }

}
