import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { ViewType } from '@app/_enums';
import { LockerMusic } from '@app/_interfaces';
import { GFormFields, GFormOptions, GsFormsComponent, GsFormsService } from 'gs-forms';
import { MusicForm, LockerFormOptions } from '@app/_forms/locker.forms';
import { LockerService } from '@app/services/locker.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AlertService } from '@app/_widgets/alert';
import { takeUntil, take } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-locker-music',
  templateUrl: './locker-music.component.html',
  styleUrls: [
    './locker-music.component.sass',
    '../locker.styles.sass'
  ]
})
export class LockerMusicComponent implements OnDestroy, OnInit {
  private destroyed$ = new Subject();
  public viewContent: ViewType;
  public viewType = ViewType;

  public musicCollection: Array<LockerMusic>;
  public music: LockerMusic;

  public formFields: GFormFields = MusicForm;
  public formOptions: GFormOptions = LockerFormOptions;

  @ViewChild(GsFormsComponent, { static: false }) formComponent: GsFormsComponent;

  constructor(
    private lockerService: LockerService,
    private loader: NgxUiLoaderService,
    private gsFormService: GsFormsService,
    private alertService: AlertService
  ) { }

  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  ngOnInit() {
    this.listMusic();
  }

  private listMusic(): void {
    this.loader.start();
    this.lockerService.listMusicCollection()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(musicCollection => {
        this.musicCollection = musicCollection;
        this.loader.stop();
      }, error => {
        console.error(error, 'LockerMusicComponent.listMusic');
        this.loader.stop();
      });
  }

  public async readMusic(musicId: string): Promise<void> {
    this.loader.start();

    await this.lockerService.readMusicDocument(musicId)
      .pipe(take(1))
      .toPromise()
      .then(music => {
        this.viewContent = ViewType.DETAIL;
        this.music = music;
        this.music.id = musicId;
        this.formFields = this.gsFormService.patchFormValues(MusicForm, music);
      })
      .catch(error => console.error(error, 'LockerMusicComponent.readMusic'))
      .finally(() => this.loader.stop());
  }

  public writeMusic(form: FormGroup): void {
    this.loader.start();

    this.lockerService[this.music ? 'updateMusicDocument' : 'createMusicDocument']({
      music: {
        title: form.value.title,
        subtitle: form.value.subtitle,
        backgroundColor: form.value.backgroundColor,
        url: form.value.url
      },
      id: this.music ? this.music.id : null
    })
      .then(() => {
        this.viewContent = null;
        this.music = null;
      })
      .catch(error => console.error(error, 'LockerMusicComponent.writeMusic'))
      .finally(() => this.loader.stop());
  }

  public deleteMusic(): void {
    this.loader.start();
    this.lockerService.deleteMusicDocument(this.music.id)
      .then(() => {
        this.viewContent = null;
        this.music = null;
        this.closeAlert('deleteMusicAlert');
      })
      .catch(error => console.error(error, 'LockerMusicComponent.deleteMusic'))
      .finally(() => this.loader.stop());
  }

  public openAlert(alertId: string): void {
    this.alertService.open(alertId);
  }

  public closeAlert(alertId: string): void {
    this.alertService.close(alertId);
  }

  public showEmptyForm(): void {
    this.loader.start();
    this.viewContent = ViewType.ADD;
    this.music = null;

    setTimeout(() => {
      if (this.formComponent) {
        this.formComponent.formActions('reset');
      }
      this.loader.stop();
    }, 500);
  }

}
