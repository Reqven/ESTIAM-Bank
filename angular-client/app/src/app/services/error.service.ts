import {ErrorHandler, Injectable, NgZone} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService implements ErrorHandler {

  constructor(
    private zone: NgZone,
    private snackBar: MatSnackBar
  ) {}

  async handleError(error: Error | HttpErrorResponse): Promise<void> {
    console.log(error);
    const message = !(error instanceof CustomError)
      ? 'An error occurred. Check console for more info.'
      : error.message;

    this.zone.run(() => {
      this.snackBar.open(message, null, { duration: 2000 });
    });
  }
}

export class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = CustomError.name;
  }
}

export function throwCustom(e: Error) {
  throwError(e).subscribe();
}
