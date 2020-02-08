import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LockerService } from '@app/services/locker.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-locker-bio',
  templateUrl: './locker-bio.component.html',
  styleUrls: [
    './locker-bio.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerBioComponent implements OnInit, OnDestroy {
  private destroyed$ = new Subject();
  public currentLang = window.localStorage.getItem('userLanguage');
  public form = new FormGroup({
    bio: new FormControl('')
  });

  // https://www.npmjs.com/package/angular-froala-wysiwyg
  public options: object = {
    placeholderText: 'Edit the bio here',
    // https://www.froala.com/wysiwyg-editor/docs/options#toolbarBottom
    toolbarButtons: ['bold', 'italic', 'underline', 'paragraphFormat']
  };

  constructor(
    private lockerService: LockerService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getBioContent();
  }

  private getBioContent(): void {
    this.lockerService.getLockerBioDocument(this.currentLang)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(bio => {
        this.form.controls.bio.patchValue(bio.content);
        this.form.controls.bio.updateValueAndValidity();
      }, error => console.error(error, 'LockerBioComponent.getBioContent'));
  }

  public onSubmit(): void {
    this.lockerService.editLockerBioDocument(this.form.value.bio, this.currentLang)
      .then(bio => {
        console.log('content updated', bio);
      }, error => console.error(error, 'LockerBioComponent.onSubmit'));
  }

}
