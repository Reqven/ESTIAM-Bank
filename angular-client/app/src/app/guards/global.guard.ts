import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild} from '@angular/router';
import { Observable } from 'rxjs';
import {combineLatest} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalGuard implements CanActivate, CanActivateChild {

  constructor(
    private auth: AuthService,
    private user: UserService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isReady();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.isReady();
  }

  isReady(): Observable<boolean> {
    const services = [
      this.auth.ready$,
      this.user.ready$,
    ];
    return combineLatest(services)
      .pipe(
        map(sources => sources.every(a => a)),
        filter((ready: boolean) => ready)
      );
  }

}
