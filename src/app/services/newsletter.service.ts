import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment as ENV } from 'src/environments/environment';
import { NewsletterSubscription, UserEmailType, UserStatus, UserLanguage } from '@app/_interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient
  ) { }

  public signup(email: string): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `apikey ${ENV.api.newsletter.key}`
      })
    };

    const url = `${ENV.api.newsletter.url}lists/${ENV.api.newsletter.listId}/members`;
    const body: NewsletterSubscription = {
      members: [
        {
          email_address: email.toLowerCase(),
          email_type: UserEmailType.HTML,
          status: UserStatus.SUBSCRIBED,
          language: UserLanguage[window.localStorage.getItem('userLanguage') || 'en']
        }
      ],
      update_existing: false
    };

    return this.http.post(url, body, httpOptions);
  }
}
