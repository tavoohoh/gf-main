import { Injectable } from '@angular/core';
import { PlayerFile } from 'gs-player';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private files: Array<PlayerFile> = [
    {
      url:
        './assets/tracks/mia.mp3',
      name: 'Mía',
      artist: 'Gian Faraone'
    },
    {
      url:
        './assets/tracks/dear-sinatra.mp3',
      name: 'Dear Sinatra',
      artist: 'Gian Faraone'
    }
  ];

  getFiles() {
    return of(this.files);
  }
}
