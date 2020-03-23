import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourcesLinks } from '@app/_enums';
import { HelperService } from '@app/services/helper.service';
import { NewsletterService } from '@app/services/newsletter.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.sass']
})
export class FooterComponent implements OnInit {
  public resourcesLinks = ResourcesLinks;
  public newsLetterForm: FormGroup;
  public newsLetterFormSuccess: string;
  public newsLetterSubmited: boolean;

  constructor(
    private newsLetterService: NewsletterService,
    private formBuilder: FormBuilder,
    private helperService: HelperService
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
        () => {
          this.newsLetterFormSuccess = 'newsletter_success';
        },
        error => {
          this.newsLetterFormSuccess = 'newsletter_failed';
          console.error('News Letter subscription failed: ', error);

          setTimeout(() => {
            this.newsLetterFormSuccess = null;
            this.newsLetterSubmited = null;
            this.newsLetterForm.reset();
          }, 5000);
        });
  }

  public validateEmailField() {
    return this.newsLetterForm.controls.email.errors && this.newsLetterForm.controls.email.errors.email;
  }

  public setLanguage(lang: string) {
    this.helperService.setLanguage(lang);
  }

}
