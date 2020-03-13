import { Component, OnInit, OnDestroy } from '@angular/core';
import { LockerService } from '@app/services/locker.service';
import { Subject } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.sass']
})
export class BioComponent implements OnInit, OnDestroy {
  public bio: string;
  public currentLang = window.localStorage.getItem('userLanguage');
  private destroyed$ = new Subject();

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
    this.lockerService.getLockerBioDocument(this.currentLang)
      .subscribe(bio => {
        this.bio = bio.content.split('<p data-f-id="pbf"')[0] || bio.content;
        this.loader.stop();
      }, error => {
        this.loader.stop();
        console.error(error, 'BioComponent.getBioContent');
      });
  }
}
