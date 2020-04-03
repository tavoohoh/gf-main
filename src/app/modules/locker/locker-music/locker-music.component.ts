import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormGroup } from '@angular/forms';
import { ViewType } from '@app/_enums';
import { LockerFormOptions, MusicForm } from '@app/_forms/locker.forms';
import { LockerMusic } from '@app/_interfaces';
import { AlertService } from '@app/_widgets/alert';
import { LockerService } from '@app/services/locker.service';
import 'firebase/storage';
import { GFormFields, GFormOptions, GsFormsComponent, GsFormsService } from 'gs-forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';

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
    private storage: AngularFireStorage,
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

    this.formFields = null;
    if (this.formComponent) {
      this.formComponent.formActions('reset');
    }

    await this.lockerService.readMusicDocument(musicId)
      .pipe(take(1))
      .toPromise()
      .then(music => {
        this.viewContent = ViewType.DETAIL;
        this.music = this.lockerService.mapMusicValues(music, true);
        this.music.id = musicId;
        this.formFields = this.gsFormService.patchFormValues(MusicForm, this.music);
      })
      .catch(error => console.error(error, 'LockerMusicComponent.readMusic'))
      .finally(() => this.loader.stop());
  }

  public writeMusic(form: FormGroup): void {
    this.loader.start();

    if (!this.music || (form.value.image !== this.music.image)) {
      const file: File = form.value.image;
      const fileRef = this.storage.ref(file.name);
      const task = this.storage.upload(file.name, file);

      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(imageUrl => {
            this.onWriteMusic(form, imageUrl);
          });
        })
      ).subscribe(() => null, error => {
        this.loader.stop();
        console.error(error, 'LockerMusicComponent.writeMusic at task.snapshotChanges');
      });
    } else {
      this.onWriteMusic(form);
    }
  }

  private onWriteMusic(form: FormGroup, image?: string): void {
    this.lockerService[this.music ? 'updateMusicDocument' : 'createMusicDocument']({
      music: {
        title: form.value.title,
        subtitle: form.value.subtitle,
        backgroundColor: form.value.backgroundColor,
        isColorWhite: form.value.isColorWhite,
        url: form.value.url,
        position: form.value.position,
        image: image ? image : ((this.music && this.music.image) ? this.music.image.path : null)
      },
      id: this.music ? this.music.id : null
    })
      .then(() => {
        this.viewContent = null;
        this.music = null;
      })
      .catch(error => console.error(error, 'LockerMusicComponent.onWriteMusic'))
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
