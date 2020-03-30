import {Component, OnInit, ViewChild} from '@angular/core';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {User} from '../../models/user';
import {State, StateWidgetComponent} from '../../components/state-widget/state-widget.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild('usersWidget', {static: false}) usersWidget: StateWidgetComponent;
  @ViewChild('apiWidget',   {static: false}) apiWidget: StateWidgetComponent;
  private users$: Observable<{ success: boolean, users: User[]}>;
  private api$: Observable<any>;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.api$ = this.http.get('http://localhost:8080')
      .pipe(
        tap(() => this.apiWidget.state = State.OK),
        catchError(e => {
          this.apiWidget.state = State.ERROR;
          return of(e.error);
        })
      );

    this.users$ = this.http.get<User[]>('http://localhost:8080/user')
      .pipe(
        map(users => {
          this.usersWidget.state = State.OK
          return { success: true, users };
        }),
        catchError(e => {
          this.usersWidget.state = State.ERROR;
          return of({ success: false, users: [] });
        })
      );
  }
}
