import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { LockerService } from '@app/services/locker.service';

@Component({
  selector: 'app-locker-bio',
  templateUrl: './locker-bio.component.html',
  styleUrls: [
    './locker-bio.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerBioComponent implements OnInit {
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

  ngOnInit() {
    this.getBioContent();
  }

  private getBioContent(): void {
    this.lockerService.getLockerBioDocument()
      .subscribe(bio => {
        this.form.controls.bio.patchValue(bio.content);
        this.form.controls.bio.updateValueAndValidity();
      }, error => console.error(error, 'LockerBioComponent.getBioContent'));
  }

  public onSubmit(): void {
    this.lockerService.editLockerBioDocument(this.form.value.bio)
      .then(bio => {
        console.log('content updated', bio);
      }, error => console.error(error, 'LockerBioComponent.onSubmit'));
  }

}
