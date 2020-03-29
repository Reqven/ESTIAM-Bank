import { Component, OnInit } from '@angular/core';
import {catchError, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private message$: Observable<any>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.message$ = this.http.get('http://localhost:8080')
      .pipe(
        tap(console.log),
        catchError(e => of(e.error))
      );
  }
}
