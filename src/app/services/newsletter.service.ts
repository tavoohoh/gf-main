import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment as ENV } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {

  constructor(
    private http: HttpClient
  ) { }

  public signup(email: string) {
    const url = `${ENV.api.newsletter.url}lists/${ENV.api.newsletter.listId}`;
    const body = {
      members: []
    };

    this.http.post(url, {});
  }
}
