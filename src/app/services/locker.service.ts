import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';

import { LockerBio } from '@app/_interfaces/locker.interface';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  constructor(
    private afs: AngularFirestore
  ) {}

  public getLockerBioDocument(language: string): Observable<LockerBio> {
    const lockerBioDocument: AngularFirestoreDocument<LockerBio> = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.valueChanges();
  }

  public editLockerBioDocument(bioContent: string, language: string): Promise<void> {
    const lockerBioDocument: AngularFirestoreDocument<LockerBio> = this.afs.doc<LockerBio>(`bio/${language}`);
    return lockerBioDocument.update({ content: bioContent });
  }

}
