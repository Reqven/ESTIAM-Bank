import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.createForm();
  }

  ngOnInit() {

  }

  createForm(): void {
    this.registerForm = this.formBuilder.group({
      firstName:  new FormControl('', Validators.required),
      lastName:   new FormControl('', Validators.required),
      email:      new FormControl('', Validators.required),
      password:   new FormControl('', Validators.required),
      address:    new FormControl('', Validators.required)
    });
  }

  onSubmit() {

  }

}
