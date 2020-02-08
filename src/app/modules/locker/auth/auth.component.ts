import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { GFormFields, GFormOptions } from 'gs-forms';
import { AuthForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
  public formFields: GFormFields = AuthForm;
  public formOptions: GFormOptions = LockerFormOptions;

  constructor(
    private fireAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.fireAuth.user.subscribe(user => {
      if (user) {

      }
    }, error => {
      console.error(error, 'AuthComponent.fireAuth.user');
    });

    this.formOptions.context.saveButton.text = 'Sign in';
    this.formOptions.layout.columns = 'auto';
  }

  public login(form: FormGroup) {
    this.fireAuth.signInWithEmailAndPassword(form.value.email, form.value.password);
  }

  public logout() {
    this.fireAuth.signOut();
  }

}
