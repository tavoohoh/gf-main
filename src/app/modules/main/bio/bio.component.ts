import { Component, OnInit } from '@angular/core';
import { LockerService } from '@app/services/locker.service';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.sass']
})
export class BioComponent implements OnInit {
  public bio: string;

  constructor(
    private lockerService: LockerService
  ) { }

  ngOnInit() {
    this.getBioContent();
  }

  private getBioContent(): void {
    this.lockerService.getLockerBioDocument()
      .subscribe(bio => {
        this.bio = bio.content;
        console.log(this.bio);
      }, error => console.error(error, 'BioComponent.getBioContent'));
  }
}
