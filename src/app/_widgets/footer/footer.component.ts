import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NewsletterService } from '@app/services/newsletter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  public newsLetterForm: FormGroup;
  public newsLetterFormSuccess: boolean;
  public newsLetterSubmited: boolean;

  constructor(
    private newsLetterService: NewsletterService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.initNewsLetterForm();
  }

  private initNewsLetterForm() {
    this.newsLetterForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  public submitNewsLetterForm() {
    if (this.newsLetterForm.invalid) {
      console.error('form invalid:', this.newsLetterForm.controls);
      return;
    }

    this.newsLetterSubmited = true;

    this.newsLetterService.signup(this.newsLetterForm.controls.email.value)
      .subscribe(
        () => this.newsLetterFormSuccess = true,
        error => {
          this.newsLetterFormSuccess = false;
          console.error('News Letter subscription failed: ', error);

          setTimeout(() => {
            this.newsLetterSubmited = false;
            this.newsLetterForm.reset();
          }, 5000);
        });
  }

  public validateEmailField() {
    return this.newsLetterForm.controls.email.errors && this.newsLetterForm.controls.email.errors.email;
  }

}
