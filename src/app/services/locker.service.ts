import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DomSanitizer } from '@angular/platform-browser';
import {
  LockerBio, LockerBookingSection,
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
  ) {
  }

  /**
   * Bio
   */
  public readBioDocument(language: string): Observable<LockerBio> {
    const document = this.afs.doc<LockerBio>(`bio/${language}`);
    return document.valueChanges();
  }

  public updateBioDocument(bioContent: string, language: string): Promise<void> {
    const document = this.afs.doc<LockerBio>(`bio/${language}`);
    return document.update({ content: bioContent });
  }

  /**
   * Gallery
   */
  private mapGalleryValues(value: any): LockerGallery {
    const data = value.payload.doc.data() as LockerGallery;
    return {
      id: value.payload.doc.id,
      title: data.title,
      position: data.position
    };
  }

  private mapGalleryPhotoValues(value: any): LockerGalleryPhoto {
    const data = value.payload.doc.data() as LockerGalleryPhoto;
    return {
      id: value.payload.doc.id,
      img: this.sanitizer.bypassSecurityTrustStyle(`url(${data.img})`),
      position: data.position,
      src: data.img
    };
  }

  public listGalleryCollection(): Observable<Array<LockerGallery>> {
    const collection = this.afs.collection<LockerGallery>('gallery', ref => ref.orderBy('position', 'asc'));
    return collection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapGalleryValues(value);
      });
    }));
  }

  public getGalleryPhotoDocument(galleryId: string): Observable<LockerGalleryPhoto[]> {
    const document = this.afs.collection<LockerGalleryPhoto>(`gallery/${galleryId}/photos`, ref => ref.orderBy('position', 'asc'));
    return document.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapGalleryPhotoValues(value);
      });
    }));
  }

  public readGalleryDocument(id: string): Observable<LockerGallery> {
    const document = this.afs.doc<LockerGallery>(`gallery/${id}`);
    return document.valueChanges();
  }

  public async createGallery(data: { gallery: LockerGallery, id?: string }): Promise<boolean> {
    const collection = this.afs.collection<LockerGallery>('gallery');
    return await collection.doc(data.id).set(data.gallery).then(() => true);
  }

  public async updateGallery(data: { gallery: LockerGallery, id: string }): Promise<boolean> {
    const collection = this.afs.doc<LockerDate>(`gallery/${data.id}`);
    return await collection.update(data.gallery).then(() => true);
  }

  public async deleteGallery(galleryId: string): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}`);
    return await document.delete().then(() => true);
  }

  public async createGalleryImage(galleryId: string, photo?: LockerGalleryPhoto): Promise<boolean> {
    const collection = this.afs.collection<{ img: string }>(`gallery/${galleryId}/photos`);
    return await collection.add(photo).then(() => true);
  }

  public async deleteGalleryImage(galleryId: string, galleryImageId: string): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}/photos/${galleryImageId}`);
    return await document.delete().then(() => true);
  }

  public async changeGalleryImagePosition(galleryId: string, photoId: string, photo: LockerGalleryPhoto): Promise<boolean> {
    const document = this.afs.doc(`gallery/${galleryId}/photos/${photoId}`);
    return await document.update(photo).then(() => true);
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

  public async createVideoDocument(data: { video: LockerVideo, id?: string }): Promise<boolean> {
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

  public async createMusicDocument(data: { music: LockerMusic, id?: string }): Promise<boolean> {
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


  /**
   * Booking
   */
  private mapBookingSectionValues(value: any): LockerBookingSection {
    const data = value.payload.doc.data() as LockerBookingSection;

    try {
      if (data.urls && typeof data.urls === 'string') {
        data.urls = JSON.parse(data.urls);

        if (data.type === 'VIDEO' && typeof data.urls === 'object') {
          // @ts-ignore
          data.urls = data.urls.map(
            url => this.sanitizer.bypassSecurityTrustResourceUrl(
              `https://www.youtube.com/embed/${url}`
            )
          );
        }
      }
    } catch {
      console.warn('Unable to parse data urls');
    }

    return {
      id: value.payload.doc.id,
      ...data
    };
  }

  public listBookingSectionCollection(): Observable<Array<LockerBookingSection>> {
    const collection = this.afs.collection<LockerBookingSection>('bookingSection', ref => ref.orderBy('position', 'asc'));
    return collection.snapshotChanges().pipe(map(actions => {
      return actions.map(value => {
        return this.mapBookingSectionValues(value);
      });
    }));
  }

  public readBookingSectionDocument(id: string): Observable<LockerBookingSection> {
    const document = this.afs.doc<LockerBookingSection>(`bookingSection/${id}`);
    return document.valueChanges();
  }

  public async createBookingSection(data: { bookingSection: LockerBookingSection, id?: string }): Promise<boolean> {
    const collection = this.afs.collection<LockerBookingSection>('bookingSection');

    if (data.bookingSection.raw_urls) {
      data.bookingSection.urls = JSON.stringify(data.bookingSection.raw_urls);

      delete data.bookingSection.raw_urls;
    }

    return await collection.add(data.bookingSection).then(() => true);
  }

  public async updateBookingSection(data: { bookingSection: LockerBookingSection, id: string }): Promise<boolean> {
    const collection = this.afs.doc<LockerBookingSection>(`bookingSection/${data.id}`);

    if (data.bookingSection.raw_urls) {
      data.bookingSection.urls = JSON.stringify(data.bookingSection.raw_urls);

      delete data.bookingSection.raw_urls;
    }

    return await collection.set(data.bookingSection).then(() => true);
  }

  public async deleteBookingSection(bookingSectionId: string): Promise<boolean> {
    const document = this.afs.doc(`bookingSection/${bookingSectionId}`);
    return await document.delete().then(() => true);
  }
}
