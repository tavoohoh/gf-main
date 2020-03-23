import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member, UserEmailType, UserLanguage, UserStatus } from '@app/_interfaces';
import { Observable } from 'rxjs';
import { environment as ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient
  ) { }

  public checkHealth(): Observable<any> {
    const url = `${ENV.api.functions}health`;
    return this.http.get(url);
  }

  public signup(email: string): Observable<any> {
    const url = `${ENV.api.functions}members`;
    const body: Member = {
      email_address: email.toLowerCase(),
      email_type: UserEmailType.HTML,
      status: UserStatus.SUBSCRIBED,
      language: UserLanguage[window.localStorage.getItem('userLanguage') || 'en']
    };

    return this.http.post(url, body);
  }
}
