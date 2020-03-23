import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { AuthService } from '@app/services/auth.service';
import { GFormFields, GFormOptions } from 'gs-forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.sass']
})
export class AuthComponent implements OnInit {
  public formFields: GFormFields = AuthForm;
  public formOptions: GFormOptions = LockerFormOptions;
  public error: boolean;

  constructor(
    private loader: NgxUiLoaderService,
    private fireAuth: AngularFireAuth,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.formOptions.context.saveButton.text = 'ADMIN.LOGIN';
    this.formOptions.layout.columns = 'auto';
  }

  public login(form: FormGroup): void {
    this.error = false;
    this.loader.start();
    this.fireAuth.signInWithEmailAndPassword(form.value.email, form.value.password)
      .then(data => {
        this.authService.setCurrentUser(data.user.email);
        this.loader.stop();
        this.router.navigateByUrl('admin');
      }).catch(() => {
        this.loader.stop();
        this.error = true;
      });
  }

}
