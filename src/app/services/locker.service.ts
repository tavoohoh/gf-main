import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import {
  LockerBio,
  LockerContactInfo,
  LockerDate,
  LockerGallery,
  LockerGalleryPhoto,
  LockerMusic,
  LockerVideo
} from '@app/_interfaces/locker.interface';
import 'firebase/firestore';
import 'firebase/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  constructor(
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer
  ) { }

  /**
   * Bio
   */
  public readBioDocument(language: string): Observable<LockerBio> {
    const document = this.afs.doc<LockerBio>(`bio/${language}`);
    return document.valueChanges();
  }

  public updateBioDocument(bioContent: string, language: string): Promise<void> {
    const document  = this.afs.doc<LockerBio>(`bio/${language}`);
    return document.update({ content: bioContent });
  }

  /**
   * Gallery
   */
  private mapGalleryValues(value: any): LockerGalleryPhoto {
    const data = value.payload.doc.data() as LockerGalleryPhoto;
    const img = this.sanitizer.bypassSecurityTrustStyle(`url(${data.img})`);
    const src = data.img;
    const id = value.payload.doc.id;
    return { id, img, src };
  }

  public listGalleryCollection(): Observable<Array<LockerGallery>> {
    const collection = this.afs.collection<LockerGallery>('gallery');
    return collection.valueChanges();
  }

  public getGalleryDocument(galleryId: string): Observable<LockerGalleryPhoto[]> {
    const document = this.afs.collection<LockerGalleryPhoto>(`gallery/${galleryId}/photos`);
    return document.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapGalleryValues(value);
      });
    }));
  }

  public async createGallery(gallery: LockerGallery): Promise<boolean> {
    const collection = this.afs.collection<LockerGallery>('gallery');
    return await collection.doc(gallery.id).set(gallery).then(() => true);
  }

  public async updateGallery(gallery: LockerGallery): Promise<boolean> {
    const collection = this.afs.doc<LockerDate>(`gallery/${gallery.id}`);
    return await collection.update({ title: gallery.title }).then(() => true);
  }

  public async deleteGallery(galleryId: string): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}`);
    return await document.delete().then(() => true);
  }

  public async createGalleryImage(galleryId: string, img?: string): Promise<boolean> {
    const collection = this.afs.collection<{ img: string }>(`gallery/${galleryId}/photos`);
    return await collection.add({ img }).then(() => true);
  }

  public async deleteGalleryImage(galleryId: string, galleryImageId: string): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}/photos/${galleryImageId}`);
    return await document.delete().then(() => true);
  }

  /**
   * Contact
   */
  public readContactInfo(): Observable<LockerContactInfo> {
    const document = this.afs.doc<LockerContactInfo>('contact/info');
    return document.valueChanges();
  }

  public updateContactInfo(contactInfo: LockerContactInfo): Promise<void> {
    const document = this.afs.doc<LockerContactInfo>('contact/info');
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

  public listDatesCollection(): Observable<Array<LockerDate>> {
    const lockerDatesCollection = this.afs.collection<LockerDate>(`dates`, ref => ref.orderBy('date', 'desc'));
    return lockerDatesCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapDateValues(value);
      });
    }));
  }

  public readDateDocument(id: string): Observable<LockerDate> {
    const document = this.afs.doc<LockerDate>(`dates/${id}`);
    return document.valueChanges();
  }

  public async createDateDocument(data: { date: LockerDate, id?: string }): Promise<boolean> {
    const collection = this.afs.collection<LockerDate>('dates');
    return await collection.add(data.date).then(() => true);
  }

  public async updateDateDocument(data: { date: LockerDate, id: string }): Promise<boolean> {
    const document = this.afs.doc<LockerDate>(`dates/${data.id}`);
    return await document.update(data.date).then(() => true);
  }

  public async deleteDateDocument(dateId: string): Promise<boolean> {
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
      position: data.position,
      url: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${data.url}`)
    };
  }

  public listVideosCollection(): Observable<Array<LockerVideo>> {
    const collection = this.afs.collection<LockerVideo>(`videos`, ref => ref.orderBy('position', 'asc'));
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
    const collection = this.afs.collection<LockerVideo>('videos');
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
  public mapMusicValues(data: any, mapImage?: boolean, id?: string): LockerMusic {
    const music = {
      id: id || '',
      title: data.title,
      subtitle: data.subtitle,
      backgroundColor: data.backgroundColor,
      isColorWhite: data.isColorWhite,
      url: data.url,
      position: data.position,
      image: data.image || '/'
    };

    if (mapImage) {
      music.image = {
        isImage: true,
        type: '',
        name: '',
        path: data.image
      };
    }

    return music;
  }

  public listMusicCollection(): Observable<Array<LockerMusic>> {
    const collection = this.afs.collection<LockerMusic>('music', ref => ref.orderBy('position', 'asc'));
    return collection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapMusicValues(
          value.payload.doc.data() as LockerMusic,
          false,
          value.payload.doc.id
        );
      });
    }));
  }

  public readMusicDocument(id: string): Observable<LockerMusic> {
    const document = this.afs.doc<LockerMusic>(`music/${id}`);
    return document.valueChanges();
  }

  public async createMusicDocument(data: { music: LockerMusic, id?: string  }): Promise<boolean> {
    const collection = this.afs.collection<LockerMusic>('music');
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
