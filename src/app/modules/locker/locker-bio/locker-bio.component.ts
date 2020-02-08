import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {

  }

  onSubmit() {
    console.log(this.form.value.bio);
  }

}
