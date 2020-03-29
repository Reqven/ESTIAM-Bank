import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {CustomError} from '../../services/error.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email:      new FormControl('', [Validators.required, Validators.email]),
      password:   new FormControl('', Validators.required)
    });
  }

  onReset() {
    this.loginForm.reset();
  }

  onSubmit() {
    if (!this.loginForm.valid) { return; }
    const { email, password } = this.loginForm.value;

    this.authService.login(email.trim(), password)
      .pipe(
        tap(this.onLoginSuccess),
        catchError(this.onLoginFail)
      ).subscribe();
  }

  onLoginSuccess = () => {
    this.snackBar.open('Login successful', null, { duration: 2000 });
    return this.router.navigateByUrl('/');
  }

  onLoginFail = (error) => {
    switch (error.status) {
      case 400: error = new CustomError('Invalid data submitted'); break;
      case 401: error = new CustomError('Login failed');           break;
    }
    return throwError(error);
  }
}
