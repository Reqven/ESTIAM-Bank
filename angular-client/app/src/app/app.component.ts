import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, take} from "rxjs/operators";
import {EMPTY, of} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-client';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get('http://localhost:8080')
      .pipe(
        take(1),
        catchError(e => of(e.error)))
      .subscribe(console.log);
  }
}
