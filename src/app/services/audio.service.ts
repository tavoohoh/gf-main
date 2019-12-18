import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { PlayerFile } from 'gs-player';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private files: Array<PlayerFile> = [
    {
      url:
        // tslint:disable-next-line: max-line-length
        './assets/tracks/mia.mp3',
      name: 'Mia',
      artist: 'Gian Faraone'
    },
    {
      url:
        // tslint:disable-next-line: max-line-length
        './assets/tracks/dear-sinatra.mp3',
      name: 'Dear Sinatra',
      artist: 'Gian Faraone'
    }
  ];

  getFiles() {
    return of(this.files);
  }
}
