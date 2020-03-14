import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import 'firebase/firestore';

import { LockerBio, LockerGallery, LockerGalleryPhotos, LockerContactInfo, LockerDate } from '@app/_interfaces/locker.interface';
import { map } from 'rxjs/operators';

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

  public async deleteLockerGallery(galleryId: string): Promise<boolean> {
    const lockerGallery = this.afs.doc(`gallery/${galleryId}`);
    return await lockerGallery.delete().then(() => true);
  }

  public async createLockerGalleryImage(galleryId: string, img: string | ArrayBuffer): Promise<boolean> {
    const lockerGalleryImage = this.afs.collection<{ img: string | ArrayBuffer }>(`gallery/${galleryId}/photos`);
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

  public async createLockerDateDocument(date: LockerDate): Promise<boolean> {
    const lockerDatesCollection = this.afs.collection<LockerDate>(`dates`);
    return await lockerDatesCollection.add(date).then(() => true);
  }

  public readLockerDateDocument(dateId: string): Observable<LockerDate> {
    const lockerDatesDocument = this.afs.doc<LockerDate>(`dates/${dateId}`);
    return lockerDatesDocument.valueChanges();
  }

  public async updateLockerDateDocument(date: LockerDate, dateId: string): Promise<boolean> {
    const lockerDatesDocument = this.afs.doc<LockerDate>(`dates/${dateId}`);
    return await lockerDatesDocument.update(date).then(() => true);
  }

  public async deleteLockerDateDocument(dateId: string): Promise<boolean> {
    const lockerGallery = this.afs.doc(`dates/${dateId}`);
    return await lockerGallery.delete().then(() => true);
  }

}
