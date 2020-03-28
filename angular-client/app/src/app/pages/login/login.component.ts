import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {catchError, tap} from 'rxjs/operators';
import {EMPTY} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm(): void {
    this.loginForm = this.formBuilder.group({
      email:      new FormControl('', Validators.required),
      password:   new FormControl('', Validators.required)
    });
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

  onLoginSuccess = async () => {
    alert('Login success !');
  }

  onLoginFail = (error: any) => {
    alert('Login failed !');
    return EMPTY;
  }

}
