import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {catchError, tap} from 'rxjs/operators';
import {CustomError} from '../../services/error.service';
import {BehaviorSubject, throwError} from 'rxjs';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  private errors$ = new BehaviorSubject<string[]>([]);

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName: new FormControl('', Validators.required),
      lastName : new FormControl('', Validators.required),
      email    : new FormControl('', [Validators.required, Validators.email]),
      password : new FormControl('', Validators.required),
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
  }

  onReset() {
    this.registerForm.reset();
    this.errors$.next([]);
  }

  onSubmit() {
    if (!this.registerForm.valid) { return; }
    const user = this.registerForm.value;
    this.errors$.next([]);

    this.userService.register(user)
      .pipe(
        tap(this.onRegisterSuccess),
        catchError(this.onRegisterFail)
      ).subscribe();
  }

  onRegisterSuccess = () => {
    this.snackBar.open('Register successful', null, { duration: 2000 });
    return this.router.navigateByUrl('/login');
  }

  onRegisterFail = (response: HttpErrorResponse) => {
    if (response.status === 400) {
      const errors: string[] = response.error.errors;
      if (errors) { this.errors$.next(errors); }
      return throwError(new CustomError('Register failed'));
    }
    return throwError(response);
  }

}
