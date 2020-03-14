import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LockerService } from '@app/services/locker.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { NgxUiLoaderService } from 'ngx-ui-loader';

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
    toolbarButtons: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'clearFormatting']
      },
      moreParagraph: {
        buttons: ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'lineHeight', 'quote']
      },
      moreRich: {
        buttons: ['insertLink']
      }
    }
  };

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.getBioContent();
  }

  private getBioContent(): void {
    this.loader.start();
    this.lockerService.readLockerBioDocument(this.currentLang)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(bio => {
        this.form.controls.bio.patchValue(bio.content);
        this.form.controls.bio.updateValueAndValidity();
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerBioComponent.getBioContent');
        this.loader.stop();
      });
  }

  public setBioContent(): void {
    this.loader.start();
    this.lockerService.updateLockerBioDocument(this.form.value.bio, this.currentLang)
      .then(() => {
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerBioComponent.setBioContent');
        this.loader.stop();
      });
  }

}
