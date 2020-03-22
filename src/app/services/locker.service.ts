import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import 'firebase/firestore';
import 'firebase/storage';

import {
  LockerBio,
  LockerGallery,
  LockerGalleryPhotos,
  LockerContactInfo,
  LockerDate,
  LockerVideo,
  LockerMusic
} from '@app/_interfaces/locker.interface';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  constructor(
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Bio
   */
  public readLockerBioDocument(language: string): Observable<LockerBio> {
    const document = this.afs.doc<LockerBio>(`bio/${language}`);
    return document.valueChanges();
  }

  public updateLockerBioDocument(bioContent: string, language: string): Promise<void> {
    const document  = this.afs.doc<LockerBio>(`bio/${language}`);
    return document.update({ content: bioContent });
  }

  /**
   * Gallery
   */
  private mapGalleryValues(value: any): LockerGalleryPhotos {
    const data = value.payload.doc.data() as LockerGalleryPhotos;
    const img = this.sanitizer.bypassSecurityTrustStyle(`url(${data.img})`);
    const id = value.payload.doc.id;
    return { id, img };
  }

  public listLockerGalleryCollection(): Observable<Array<LockerGallery>> {
    const collection = this.afs.collection<LockerGallery>(`gallery`);
    return collection.valueChanges();
  }

  public getLockerGalleryDocument(galleryId: string): Observable<LockerGalleryPhotos[]> {
    const document = this.afs.collection<LockerGalleryPhotos>(`gallery/${galleryId}/photos`);
    return document.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapGalleryValues(value);
      });
    }));
  }

  public async createLockerGallery(gallery: LockerGallery): Promise<boolean> {
    const collection = this.afs.collection<LockerGallery>(`gallery`);
    return await collection.doc(gallery.id).set(gallery).then(() => true);
  }

  public async updateLockerGallery(gallery: LockerGallery): Promise<boolean> {
    const collection = this.afs.doc<LockerDate>(`gallery/${gallery.id}`);
    return await collection.update({ title: gallery.title }).then(() => true);
  }

  public async deleteLockerGallery(galleryId: string): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}`);
    return await document.delete().then(() => true);
  }

  public async createLockerGalleryImage(galleryId: string, img?: string): Promise<boolean> {
    const collection = this.afs.collection<{ img: string }>(`gallery/${galleryId}/photos`);
    return await collection.add({ img }).then(() => true);
  }

  public async deleteLockerGalleryImage(galleryId: string, galleryImageId: string): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}/photos/${galleryImageId}`);
    return await document.delete().then(() => true);
  }

  /**
   * Contact
   */
  public readLockerContactInfo(): Observable<LockerContactInfo> {
    const document = this.afs.doc<LockerContactInfo>(`contact/info`);
    return document.valueChanges();
  }

  public updateLockerContactInfo(contactInfo: LockerContactInfo): Promise<void> {
    const document = this.afs.doc<LockerContactInfo>(`contact/info`);
    return document.update(contactInfo);
  }

  /**
   * Dates
   */
  private mapDateValues(value: any): LockerDate {
    const data = value.payload.doc.data() as LockerDate;
    const id = value.payload.doc.id;
    return {
      id,
      title: data.title,
      location: data.location,
      date: data.date,
      published: data.published
    };
  }

  public listLockerDatesCollection(): Observable<Array<LockerDate>> {
    const lockerDatesCollection = this.afs.collection<LockerDate>(`dates`);
    return lockerDatesCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapDateValues(value);
      });
    }));
  }

  public readLockerDateDocument(id: string): Observable<LockerDate> {
    const document = this.afs.doc<LockerDate>(`dates/${id}`);
    return document.valueChanges();
  }

  public async createLockerDateDocument(data: { date: LockerDate, id?: string }): Promise<boolean> {
    const collection = this.afs.collection<LockerDate>(`dates`);
    return await collection.add(data.date).then(() => true);
  }

  public async updateLockerDateDocument(data: { date: LockerDate, id: string }): Promise<boolean> {
    const document = this.afs.doc<LockerDate>(`dates/${data.id}`);
    return await document.update(data.date).then(() => true);
  }

  public async deleteLockerDateDocument(dateId: string): Promise<boolean> {
    const document = this.afs.doc(`dates/${dateId}`);
    return await document.delete().then(() => true);
  }

  /**
   * Videos
   */
  private mapVideoValues(value: any): LockerVideo {
    const data = value.payload.doc.data() as LockerVideo;
    const id = value.payload.doc.id;
    return {
      id,
      title: data.title,
      url: data.url
    };
  }

  public listVideosCollection(): Observable<Array<LockerVideo>> {
    const collection = this.afs.collection<LockerVideo>(`videos`);
    return collection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapVideoValues(value);
      });
    }));
  }

  public readVideoDocument(id: string): Observable<LockerVideo> {
    const document = this.afs.doc<LockerVideo>(`videos/${id}`);
    return document.valueChanges();
  }

  public async createVideoDocument(data: { video: LockerVideo, id?: string  }): Promise<boolean> {
    const collection = this.afs.collection<LockerVideo>(`videos`);
    return await collection.add(data.video).then(() => true);
  }

  public async updateVideoDocument(data: { video: LockerVideo, id: string }): Promise<boolean> {
    const document = this.afs.doc<LockerVideo>(`videos/${data.id}`);
    return await document.update(data.video).then(() => true);
  }

  public async deleteVideoDocument(dateId: string): Promise<boolean> {
    const document = this.afs.doc(`videos/${dateId}`);
    return await document.delete().then(() => true);
  }

  /**
   * Music
   */
  private mapMusicValues(value: any): LockerMusic {
    const data = value.payload.doc.data() as LockerMusic;
    const id = value.payload.doc.id;
    return {
      id,
      title: data.title,
      subtitle: data.subtitle,
      backgroundColor: data.backgroundColor,
      url: data.url,
      image: data.image || ''
    };
  }

  public listMusicCollection(): Observable<Array<LockerMusic>> {
    const collection = this.afs.collection<LockerMusic>(`music`);
    return collection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapMusicValues(value);
      });
    }));
  }

  public readMusicDocument(id: string): Observable<LockerMusic> {
    const document = this.afs.doc<LockerMusic>(`music/${id}`);
    return document.valueChanges();
  }

  public async createMusicDocument(data: { music: LockerMusic, id?: string  }): Promise<boolean> {
    const collection = this.afs.collection<LockerMusic>(`music`);
    return await collection.add(data.music).then(() => true);
  }

  public async updateMusicDocument(data: { music: LockerMusic, id: string }): Promise<boolean> {
    const document = this.afs.doc<LockerMusic>(`music/${data.id}`);
    return await document.update(data.music).then(() => true);
  }

  public async deleteMusicDocument(dateId: string): Promise<boolean> {
    const document = this.afs.doc(`music/${dateId}`);
    return await document.delete().then(() => true);
  }
}
