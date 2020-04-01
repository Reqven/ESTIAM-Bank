import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {User} from '../models/user';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, filter, shareReplay, switchMap, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _cacheKey = '_user';
  private readonly _ready$ = new BehaviorSubject<boolean>(false);
  private readonly _user$ = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private auth: AuthService
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

  get user(): User {
    return this._user$.value;
  }

  register(user: User): Observable<User> {
    const url = 'http://localhost:8080/user';
    return this.http.post<User>(url, user);
  }

  update(user: User): Observable<User> {
    const url = 'http://localhost:8080/account';
    const headers = new HttpHeaders({ Authorization: `jwt ${this.auth.credentials.token}` });

    return this.http.put<User>(url, user, { headers })
      .pipe(
        tap(updatedUser => this._user$.next(updatedUser)),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  delete(): Observable<any> {
    const url = 'http://localhost:8080/account';
    const headers = new HttpHeaders({ Authorization: `jwt ${this.auth.credentials.token}` });

    return this.http.delete(url, { headers })
      .pipe(
        tap(() => this.auth.logout()),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  load(): Observable<User> {
    const url = 'http://localhost:8080/account';
    const headers = new HttpHeaders({ Authorization: `jwt ${this.auth.credentials.token}` });

    return this.http.get<User>(url, { headers })
      .pipe(
        tap(user => this._user$.next(user)),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  private init(): void {
    const user = this.getFromCache();
    if (user) { this._user$.next(user); }
    this._ready$.next(true);

    this.user$
      .pipe(tap(this.saveToCache))
      .subscribe();

    this.auth.credentials$
      .pipe(
        filter(credentials => !!credentials),
        switchMap(() => this.load())
      ).subscribe();
  }

  private getFromCache = (): User => {
    return JSON.parse(localStorage.getItem(this._cacheKey)) as User;
  }

  private saveToCache = (user: User): void => {
    localStorage.setItem(this._cacheKey, JSON.stringify(user));
  }

}
