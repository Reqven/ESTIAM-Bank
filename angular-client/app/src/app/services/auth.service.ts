import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, distinctUntilChanged, shareReplay, tap} from 'rxjs/operators';
import {Credentials} from '../models/credentials';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly cacheKey = '_credentials';
  private readonly _ready$ = new BehaviorSubject<boolean>(false);
  private readonly _credentials$ = new BehaviorSubject<Credentials>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.init();
  }

  get ready$(): Observable<boolean> {
    return this._ready$.asObservable().pipe(
      distinctUntilChanged(),
      shareReplay()
    );
  }

  get credentials$(): Observable<Credentials> {
    return this._credentials$.asObservable().pipe(
      distinctUntilChanged(),
      shareReplay()
    );
  }

  login(email: string, password: string): Observable<Credentials> {
    const url = 'http://localhost:8080/auth/token';
    return this.http.post<Credentials>(url, { email, password })
      .pipe(
        tap(credentials => this._credentials$.next(credentials)),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  logout() {
    this._credentials$.next(null);
    this.snackBar.open('You have been logged out', null, { duration: 2000 });
    return this.router.navigateByUrl('/login');
  }

  isLogged(): boolean {
    return !!this._credentials$.value;
  }

  private init(): void {
    const credentials = this.getFromCache();
    if (credentials) { this._credentials$.next(credentials); }
    this._ready$.next(true);

    this._credentials$
      .pipe(tap(this.saveToCache))
      .subscribe();
  }

  private getFromCache = (): Credentials => {
    return JSON.parse(localStorage.getItem(this.cacheKey)) as Credentials;
  }

  private saveToCache = (credentials: Credentials): void => {
    localStorage.setItem(this.cacheKey, JSON.stringify(credentials));
  }
}
