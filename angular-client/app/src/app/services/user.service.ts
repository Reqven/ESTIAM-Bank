import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from '../models/user';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, shareReplay, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly cacheKey = '_user';
  private readonly _ready$ = new BehaviorSubject<boolean>(false);
  private readonly _user$ = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient
  ) {
    this.init();
  }

  get ready$(): Observable<boolean> {
    return this._ready$.asObservable().pipe(
      distinctUntilChanged(),
      shareReplay()
    );
  }

  get user$(): Observable<User> {
    return this._user$.asObservable().pipe(
      distinctUntilChanged(),
      shareReplay()
    );
  }

  register(user: User): Observable<User> {
    const url = 'http://localhost:8080/register';
    return this.http.post<User>(url, user);
  }

  private init(): void {
    const user = this.getFromCache();
    if (user) { this._user$.next(user); }
    this._ready$.next(true);

    this.user$
      .pipe(tap(this.saveToCache))
      .subscribe();
  }

  private getFromCache = (): User => {
    return JSON.parse(localStorage.getItem(this.cacheKey)) as User;
  }

  private saveToCache = (user: User): void => {
    localStorage.setItem(this.cacheKey, JSON.stringify(user));
  }

}
