import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Credentials} from '../models/credentials';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private cacheKey = '_credentials';
  private credentials$ = new BehaviorSubject<Credentials>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.init();
  }

  login(email: string, password: string): Observable<Credentials> {
    const url = 'http://localhost:8080/auth/token';
    return this.http.post<Credentials>(url, { email, password })
      .pipe(
        tap(credentials => this.credentials$.next(credentials)),
        catchError((error: HttpErrorResponse) => {
          return throwError(error);
        })
      );
  }

  logout() {
    this.credentials$.next(null);
    this.snackBar.open('You have been logged out', null, { duration: 2000 });
    return this.router.navigateByUrl('/login');
  }

  isLogged(): boolean {
    return !!this.credentials$.value;
  }

  private init(): void {
    const credentials = this.getFromCache();
    if (credentials) { this.credentials$.next(credentials); }

    this.credentials$
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
