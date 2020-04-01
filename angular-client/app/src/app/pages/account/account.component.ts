import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BehaviorSubject, throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '../../services/user.service';
import {catchError, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {CustomError} from '../../services/error.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  private userForm: FormGroup;
  private errors$ = new BehaviorSubject<string[]>([]);

  constructor(
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required),
      email    : new FormControl('', [Validators.required, Validators.email]),
      address  : new FormGroup({
        address  : new FormControl('', Validators.required),
        city     : new FormControl('', Validators.required),
        zipcode  : new FormControl('', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(5),
          Validators.maxLength(5)
        ])
      })
    });
    this.userForm.patchValue(this.userService.user);
  }

  onSubmit() {
    if (!this.userForm.valid) { return; }
    const user = this.userForm.value;
    this.errors$.next([]);

    this.userService.update(user)
      .pipe(
        tap(this.onUpdateSuccess),
        catchError(this.onUpdateFail)
      ).subscribe();
  }

  onDelete() {
    this.userService.delete()
      .pipe(
        tap(this.onDeleteSuccess),
        catchError(this.onDeleteFail)
      ).subscribe();
  }

  onUpdateSuccess = () => {
    this.snackBar.open('Account update successful', null, { duration: 2000 });
  }
  onUpdateFail = (response: HttpErrorResponse) => {
    if (response.status === 400) {
      const errors: string[] = response.error.errors;
      if (errors) { this.errors$.next(errors); }
      return throwError(new CustomError('Account update failed'));
    }
    return throwError(response);
  }

  onDeleteSuccess = () => {
    this.snackBar.open('Account deleted', null, { duration: 2000 });
  }
  onDeleteFail = () => {
    return throwError(new CustomError('Account delete failed'));
  }

}
