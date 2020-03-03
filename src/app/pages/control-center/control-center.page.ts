import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

import { ConfigService } from '../../services/config/config.service';
import { RepoService } from 'src/app/services/repo/repo.service';
import { SensorService } from '../../services/sensor/sensor.service';

import { CustomClassEntity } from 'src/app/entities/customClass.entity';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/services/language/language.service';

@Component({
  selector: 'app-control-center',
  templateUrl: './control-center.page.html',
  styleUrls: ['./control-center.page.scss'],
})
export class ControlCenterPage implements OnInit {
  locationEnabled: boolean;
  pedometerEnabled: boolean;
  gyroscopeEnabled: boolean;

  customClasses: CustomClassEntity[];

  text = {
    header: '',
    sensors: '',
    pedometer: '',
    location: '',
    gyroscope: '',
    beta: '',
    customClass: '',
    updateButton: '',
  };
  subscriptions = new Subscription();

  constructor(
    private alertController: AlertController,
    private configService: ConfigService,
    private language: LanguageService,
    private navCtrl: NavController,
    private sensorService: SensorService,
    private repoService: RepoService
  ) {
    this.subscribeText();
  }

  ngOnInit() {
    this.language.updateText();
    this.locationEnabled = this.configService.isLocationSensorOn();
    this.pedometerEnabled = this.configService.isPedometerSensorOn();
    this.gyroscopeEnabled = this.configService.isGyroscopeSensorOn();
  }

  async ionViewWillEnter() {
    this.customClasses = await this.repoService.getCustomClassWithRecordOrderByIdDesc();
  }

  handleLocationToggleChange() {
    this.sensorService.updateLocationSensorStatus(this.locationEnabled);
  }

  handlePedometerToggleChange() {
    this.sensorService.updatePedometerSensorStatus(this.pedometerEnabled);
  }

  handleGyroscopeToggleChange() {
    this.sensorService.updateGyroscopeSensorStatus(this.gyroscopeEnabled);
  }

  async delete(customClass: CustomClassEntity) {
    const alert = await this.alertController.create({
      header: 'Delete data class confirmation',
      message: `Are you sure you want to delete ${customClass.name}?`,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Yes',
          handler: async () => {
            await this.repoService.removeCustomClass([customClass]);
            this.customClasses = await this.repoService.getCustomClassWithRecordOrderByIdDesc();
          }
        }
      ]
    });
    await alert.present();
  }

  update() {
    const updates = [];
    this.customClasses.forEach(async element => {
      updates.push(this.repoService.saveCustomClass(element));
      updates.push(this.repoService.saveCustomClassRecord(element.records));
    });
    Promise.all(updates)
      .then(_ => {
        this.navCtrl.navigateRoot(['/tabs']);
      })
      .catch(err => {
        console.log(err);
      });
  }

  OnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private subscribeText() {
    this.subscriptions.add(this.language.text.record.header.get()
    .subscribe(res => this.text.header = res));
    this.subscriptions.add(this.language.text.record.sensors.get()
    .subscribe(res => this.text.sensors = res));
    this.subscriptions.add(this.language.text.record.pedometer.get()
    .subscribe(res => this.text.pedometer = res));
    this.subscriptions.add(this.language.text.record.location.get()
    .subscribe(res => this.text.location = res));
    this.subscriptions.add(this.language.text.record.gyroscope.get()
    .subscribe(res => this.text.gyroscope = res));
    this.subscriptions.add(this.language.text.record.beta.get()
    .subscribe(res => this.text.beta = res));
    this.subscriptions.add(this.language.text.record.customClass.get()
    .subscribe(res => this.text.customClass = res));
    this.subscriptions.add(this.language.text.record.updateButton.get()
    .subscribe(res => this.text.updateButton = res));
  }


}
