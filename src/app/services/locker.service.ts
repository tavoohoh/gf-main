import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';

import { LockerBio } from '@app/_interfaces/locker.interface';

@Injectable({
  providedIn: 'root'
})
export class LockerService {
  private language = 'en';

  constructor(
    private afs: AngularFirestore
  ) { }

  public getLockerBioDocument(): Observable<LockerBio> {
    const lockerBioDocument: AngularFirestoreDocument<LockerBio> = this.afs.doc<LockerBio>(`bio/${this.language}`);
    return lockerBioDocument.valueChanges();
  }

  public editLockerBioDocument(bioContent: string): Promise<void> {
    const lockerBioDocument: AngularFirestoreDocument<LockerBio> = this.afs.doc<LockerBio>(`bio/${this.language}`);
    return lockerBioDocument.update({ content: bioContent });
  }


}
