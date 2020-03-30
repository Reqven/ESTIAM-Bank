import { Component } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-state-widget',
  templateUrl: './state-widget.component.html',
  styleUrls: ['./state-widget.component.scss']
})
export class StateWidgetComponent {

  private States = State;
  private state$ = new BehaviorSubject<State>(State.LOADING);

  constructor() { }

  get state() {
    return this.state$.value;
  }

  set state(state: State) {
    this.state$.next(state);
  }
}

export enum State {
  LOADING = 1,
  ERROR,
  OK
}
