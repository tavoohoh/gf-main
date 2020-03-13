import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import 'firebase/firestore';

import { LockerBio, LockerGallery, LockerGalleryPhotos, LockerContactInfo } from '@app/_interfaces/locker.interface';
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
  public getLockerBioDocument(language: string): Observable<LockerBio> {
    const lockerBioDocument = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.valueChanges();
  }

  public setLockerBioDocument(bioContent: string, language: string): Promise<void> {
    const lockerBioDocument  = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.update({ content: bioContent });
  }

  /**
   * Gallery
   */
  public getLockerGalleryCollection(): Observable<Array<LockerGallery>> {
    const lockerGalleryCollection = this.afs.collection<LockerGallery>(`gallery`);
    return lockerGalleryCollection.valueChanges();
  }

  public getLockerGalleryDocumentCollection(galleryId: string): Observable<LockerGalleryPhotos[]> {
    const lockerGalleryDocumentCollection = this.afs.collection<LockerGalleryPhotos>(`gallery/${galleryId}/photos`);
    return lockerGalleryDocumentCollection.snapshotChanges().pipe(map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as LockerGalleryPhotos;
        const img = this.sanitizer.bypassSecurityTrustStyle(`url(${data.img})`);
        const id = a.payload.doc.id;
        return { id, img };
      });
    }));
  }

  public async addLockerGallery(gallery: LockerGallery): Promise<boolean> {
    const lockerGalleryCollection = this.afs.collection<LockerGallery>(`gallery`);
    return await lockerGalleryCollection.doc(gallery.id).set(gallery).then(() => true);
  }

  public async addLockerGalleryImage(galleryId: string, img: string | ArrayBuffer): Promise<boolean> {
    const lockerGalleryImage = this.afs.collection<{ img: string | ArrayBuffer }>(`gallery/${galleryId}/photos`);
    return await lockerGalleryImage.add({ img }).then(() => true);
  }

  public async deleteLockerGallery(galleryId: string): Promise<boolean> {
    const lockerGallery = this.afs.doc(`gallery/${galleryId}`);
    return await lockerGallery.delete().then(() => true);
  }

  public async deleteLockerGalleryImage(galleryId: string, galleryImageId: string): Promise<boolean> {
    const lockerGalleryImage = this.afs.doc(`gallery/${galleryId}/photos/${galleryImageId}`);
    return await lockerGalleryImage.delete().then(() => true);
  }

  /**
   * Contact
   */
  public getLockerContactInfo(): Observable<LockerContactInfo> {
    const lockerContactInfo = this.afs.doc<LockerContactInfo>(`contact/info`);
    return lockerContactInfo.valueChanges();
  }

  public setLockerContactInfo(contactInfo: LockerContactInfo): Promise<void> {
    const lockerContactInfo = this.afs.doc<LockerContactInfo>(`contact/info`);
    return lockerContactInfo.update(contactInfo);
  }

}
