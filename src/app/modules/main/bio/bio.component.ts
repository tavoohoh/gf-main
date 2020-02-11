import { Component, OnInit } from '@angular/core';
import { LockerService } from '@app/services/locker.service';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.sass']
})
export class BioComponent implements OnInit {
  public bio: string;
  public currentLang = window.localStorage.getItem('userLanguage');

  constructor(
    private lockerService: LockerService
  ) { }

  ngOnInit() {
    this.getBioContent();
  }

  private getBioContent(): void {
    this.lockerService.getLockerBioDocument(this.currentLang)
      .subscribe(bio => {
        this.bio = bio.content;
      }, error => console.error(error, 'BioComponent.getBioContent'));
  }
}
