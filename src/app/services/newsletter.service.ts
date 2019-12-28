import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as ENV } from 'src/environments/environment';
import { NewsletterSubscription, UserEmailType, UserStatus, UserLanguage } from '@app/_interfaces';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient
  ) { }

  public signup(email: string) {
    const url = `${ENV.api.newsletter.url}lists/${ENV.api.newsletter.listId}`;
    const body: NewsletterSubscription = {
      members: [
        {
          email_address: email,
          email_type: UserEmailType.HTML,
          status: UserStatus.SUBSCRIBED,
          language: UserLanguage[window.localStorage.getItem('userLanguage') || 'en']
        }
      ],
      update_existing: false
    };

    this.http.post(url, body);
  }
}
