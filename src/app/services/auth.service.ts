import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private $currentUser = new BehaviorSubject<string>(null);

  public get currentUserValue(): string {
    return this.$currentUser.value;
  }

  public currentUserFromStorage(): boolean {
    return localStorage.getItem('gfuser') ? true : false;
  }

  public removeCurrentUser(): void {
    localStorage.removeItem('gfuser');
    this.$currentUser.next(null);
  }

  public setCurrentUser(currentUser: string): void {
    localStorage.setItem('gfuser', currentUser);
    this.$currentUser.next(currentUser);
  }

  public currentUserAsObservable(): Observable<string> {
    return this.$currentUser.asObservable();
  }
}
