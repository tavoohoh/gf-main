import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import 'firebase/firestore';
import 'firebase/storage';

import {
  LockerBio,
  LockerGallery,
  LockerGalleryPhotos,
  LockerContactInfo,
  LockerDate,
  LockerVideo
} from '@app/_interfaces/locker.interface';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private sanitizer: DomSanitizer
  ) {}

  /**
   * Bio
   */
  public readLockerBioDocument(language: string): Observable<LockerBio> {
    const lockerBioDocument = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.valueChanges();
  }

  public updateLockerBioDocument(bioContent: string, language: string): Promise<void> {
    const lockerBioDocument  = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.update({ content: bioContent });
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
    const lockerGalleryCollection = this.afs.collection<LockerGallery>(`gallery`);
    return lockerGalleryCollection.valueChanges();
  }

  public getLockerGalleryDocument(galleryId: string): Observable<LockerGalleryPhotos[]> {
    const lockerGalleryDocument = this.afs.collection<LockerGalleryPhotos>(`gallery/${galleryId}/photos`);
    return lockerGalleryDocument.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapGalleryValues(value);
      });
    }));
  }

  public async createLockerGallery(gallery: LockerGallery): Promise<boolean> {
    const lockerGalleryCollection = this.afs.collection<LockerGallery>(`gallery`);
    return await lockerGalleryCollection.doc(gallery.id).set(gallery).then(() => true);
  }

  public async updateLockerGallery(gallery: LockerGallery): Promise<boolean> {
    const lockerGalleryCollection = this.afs.doc<LockerDate>(`gallery/${gallery.id}`);
    return await lockerGalleryCollection.update({ title: gallery.title }).then(() => true);
  }

  public async deleteLockerGallery(galleryId: string): Promise<boolean> {
    const lockerGallery = this.afs.doc(`gallery/${galleryId}`);
    return await lockerGallery.delete().then(() => true);
  }

  public async createLockerGalleryImage(galleryId: string, img?: string): Promise<boolean> {
    const lockerGalleryImage = this.afs.collection<{ img: string }>(`gallery/${galleryId}/photos`);
    return await lockerGalleryImage.add({ img }).then(() => true);
  }

  public async deleteLockerGalleryImage(galleryId: string, galleryImageId: string): Promise<boolean> {
    const lockerGalleryImage = this.afs.doc(`gallery/${galleryId}/photos/${galleryImageId}`);
    return await lockerGalleryImage.delete().then(() => true);
  }

  /**
   * Contact
   */
  public readLockerContactInfo(): Observable<LockerContactInfo> {
    const lockerContactInfo = this.afs.doc<LockerContactInfo>(`contact/info`);
    return lockerContactInfo.valueChanges();
  }

  public updateLockerContactInfo(contactInfo: LockerContactInfo): Promise<void> {
    const lockerContactInfo = this.afs.doc<LockerContactInfo>(`contact/info`);
    return lockerContactInfo.update(contactInfo);
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
    const lockerDatesDocument = this.afs.doc<LockerDate>(`dates/${id}`);
    return lockerDatesDocument.valueChanges();
  }

  public async createLockerDateDocument(data: { date: LockerDate, id?: string }): Promise<boolean> {
    const lockerDatesCollection = this.afs.collection<LockerDate>(`dates`);
    return await lockerDatesCollection.add(data.date).then(() => true);
  }

  public async updateLockerDateDocument(data: { date: LockerDate, id: string }): Promise<boolean> {
    const lockerDatesDocument = this.afs.doc<LockerDate>(`dates/${data.id}`);
    return await lockerDatesDocument.update(data.date).then(() => true);
  }

  public async deleteLockerDateDocument(dateId: string): Promise<boolean> {
    const lockerGallery = this.afs.doc(`dates/${dateId}`);
    return await lockerGallery.delete().then(() => true);
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
    const videosCollection = this.afs.collection<LockerVideo>(`videos`);
    return videosCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapVideoValues(value);
      });
    }));
  }

  public readVideoDocument(id: string): Observable<LockerVideo> {
    const videosDocument = this.afs.doc<LockerVideo>(`videos/${id}`);
    return videosDocument.valueChanges();
  }

  public async createVideoDocument(data: { video: LockerVideo, id?: string  }): Promise<boolean> {
    const videosCollection = this.afs.collection<LockerVideo>(`videos`);
    return await videosCollection.add(data.video).then(() => true);
  }

  public async updateVideoDocument(data: { video: LockerVideo, id: string }): Promise<boolean> {
    const videoDocument = this.afs.doc<LockerVideo>(`videos/${data.id}`);
    return await videoDocument.update(data.video).then(() => true);
  }

  public async deleteVideoDocument(dateId: string): Promise<boolean> {
    const videoDocument = this.afs.doc(`videos/${dateId}`);
    return await videoDocument.delete().then(() => true);
  }
}
