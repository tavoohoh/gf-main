import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { DomSanitizer } from '@angular/platform-browser';

import { LockerBio, LockerGallery, LockerGalleryPhotos } from '@app/_interfaces/locker.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  constructor(
    private afs: AngularFirestore,
    private sanitizer: DomSanitizer
  ) {}

  public getLockerBioDocument(language: string): Observable<LockerBio> {
    const lockerBioDocument = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.valueChanges();
  }

  public editLockerBioDocument(bioContent: string, language: string): Promise<void> {
    const lockerBioDocument  = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.update({ content: bioContent });
  }

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

  public async sendLockerGalleryImage(galleryId: string, img: string | ArrayBuffer): Promise<boolean> {
    const lockerGalleryImage = this.afs.collection<{ img: string | ArrayBuffer }>(`gallery/${galleryId}/photos`);
    return await lockerGalleryImage.add({ img }).then(() => true);
  }

}
