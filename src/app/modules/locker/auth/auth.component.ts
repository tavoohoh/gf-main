import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import { GFormFields, GFormOptions } from 'gs-forms';
import { AuthForm, LockerFormOptions } from '@app/_forms/locker.forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
  public formFields: GFormFields = AuthForm;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
    this.formOptions.context.saveButton.text = 'Sign in';
    this.formOptions.layout.columns = 'auto';
  }

  public login(form: FormGroup) {
    this.fireAuth.signInWithEmailAndPassword(form.value.email, form.value.password)
      .then(() => this.router.navigate(['admin']));
  }

}
