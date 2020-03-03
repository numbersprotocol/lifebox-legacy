import { Injectable } from '@angular/core';

import {
  BackgroundGeolocation,
  BackgroundGeolocationEvents,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Pedometer, IPedometerData } from '@ionic-native/pedometer/ngx';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';

import { Subscription } from 'rxjs';

import { CommService } from '../comm/comm.service';
import { ConfigService } from '../config/config.service';
import { DataService } from '../data/data.service';

import { LocationEntity } from '../../entities/location.entity';
import { PedometerEntity } from '../../entities/pedometer.entity';
import { GyroscopeEntity } from '../../entities/gyroscope.entity';
import { IodoorDataEntity, StepsDataEntity } from '../../entities/daily-data.entity';
import { RepoService } from '../repo/repo.service';

const locationConfig = {
  desiredAccuracy: 0,
  stationaryRadius: 1,
  distanceFilter: 1,
  stopOnTerminate: false,
  debug: false,
  notificationTitle: 'Lifebox Location Sensor',
  notificationText: 'Location data is being collected in background',
  activityType: 'AutomotiveNavigation',
  locationProvider: 0,
  interval: 1000,
  fastestInterval: 1000,
  activitiesInterval: 1000
};

const gyroOption: GyroscopeOptions = {
  frequency: 3000
};

@Injectable({
  providedIn: 'root'
})
export class SensorService {
  locationSubscription: Subscription = null;
  pedometerSubscription: Subscription = null;
  stationarySubscription: Subscription = null;
  gyroscopeSubscription: Subscription = null;

  constructor(
    private location: BackgroundGeolocation,
    private diagnostic: Diagnostic,
    private pedometer: Pedometer,
    private gyroscope: Gyroscope,
    private commService: CommService,
    private configService: ConfigService,
    private dataService: DataService,
    private repoService: RepoService
  ) { }

  configureLocationWatcher() {
    this.location.configure(locationConfig);
    this.locationSubscription = this.location.on(BackgroundGeolocationEvents.location).subscribe((data) => {
      this.locationEventHandler(data);
    });
    this.stationarySubscription = this.location.on(BackgroundGeolocationEvents.stationary).subscribe((data) => {
      this.locationEventHandler(data);
    });
    console.log('Location Sensor configured');
  }

  async updateLocationSensorStatus(toggle: boolean = null) {
    if (toggle !== null) { await this.configService.toggleLocationSensor(toggle); }
    const status = await this.configService.isLocationSensorOn();
    status ? this.watchLocationData() : this.unwatchLocationData();
    this.dataService.addLocationStatus(status).then(res => {
      console.log('locationStatus added: ', res);
    });
  }

  async updatePedometerSensorStatus(toggle: boolean = null) {
    if (toggle !== null) { await this.configService.togglePedometerSensor(toggle); }
    const status = await this.configService.isPedometerSensorOn();
    status ? this.watchPedometerData() : this.unwatchPedometerData();
    this.dataService.addPedometerStatus(status).then(res => {
      console.log('pedometerStatus added: ', res);
    });
  }

  async updateGyroscopeSensorStatus(toggle: boolean = null) {
    if (toggle !== null) { await this.configService.toggleGyroscopeSensor(toggle); }
    (await this.configService.isGyroscopeSensorOn()) ? this.watchGyroscopeData() : this.unwatchGyroscopeData();
  }

  private createLocationEntity(data: BackgroundGeolocationResponse) {
    const locationEntity = new LocationEntity();
    locationEntity.dataTimestamp = new Date().getTime();
    Object.assign(locationEntity, data);
    return locationEntity;
  }

  private createPedometerEntity(data: IPedometerData) {
    const pedometerEntity = new PedometerEntity();
    pedometerEntity.dataTimestamp = new Date().getTime();
    Object.assign(pedometerEntity, data);
    return pedometerEntity;
  }

  private createGyroscopeEntity(data: GyroscopeOrientation) {
    const gyroscopeEntity = new GyroscopeEntity();
    gyroscopeEntity.dataTimestamp = data.timestamp;
    gyroscopeEntity.x = data.x;
    gyroscopeEntity.y = data.y;
    gyroscopeEntity.z = data.z;
    return gyroscopeEntity;
  }

  private locationEventHandler(data: BackgroundGeolocationResponse) {
    this.repoService.saveLocation(this.createLocationEntity(data))
      .then((res) => console.log('Save location entity: ', res))
      .catch(e => console.log(e));

    this.dataService.getDailyIodoorData(new Date()).then((iodoorData: IodoorDataEntity) => {
      this.repoService.saveIodoorData(iodoorData).catch(e => console.error(e));
      this.dataService.addIodoorMeta(new Date()).then(() => {
        this.commService.sendIodoorMeta();
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  private pedometerEventHandler(data: IPedometerData) {
    this.repoService.savePedometer(this.createPedometerEntity(data))
      .then((res) => console.log('Save pedometer entity: ', res))
      .catch(e => console.log(e));

    this.dataService.getDailyStepsData(new Date()).then((stepsData: StepsDataEntity) => {
      this.repoService.saveStepsData(stepsData).catch(e => console.error(e));
      this.dataService.addStepsMeta(new Date()).then(() => {
        this.commService.sendStepsMeta();
      }).catch(e => console.log(e));
    }).catch(e => console.log(e));
  }

  private gyroscopeEventHandler(data: GyroscopeOrientation) {
    console.log('Gyroscope data: ', data);
    this.repoService.saveGyroscope(this.createGyroscopeEntity(data))
      .then(res => console.log('Save gyroscope entity: ', res))
      .catch(e => console.log(e));
    console.log('Gyroscope db: ', this.repoService.findGyroscope());
  }

  private watchLocationData() {
    this.location.start();
    console.log('Start location data collection');
  }

  private unwatchLocationData() {
    this.location.stop();
    console.log('Stop location data collection');
  }

  private watchPedometerData() {
    this.pedometerSubscription = this.pedometer.startPedometerUpdates()
      .subscribe((data: IPedometerData) => {
        this.pedometerEventHandler(data);
      });
    console.log('Start pedometer data collection');
  }

  private unwatchPedometerData() {
    this.pedometer.stopPedometerUpdates();
    this.unsubscribe(this.pedometerSubscription);
    console.log('Stop pedometer data collection');
  }

  private watchGyroscopeData() {
    this.gyroscopeSubscription = this.gyroscope.watch(gyroOption)
      .subscribe((data: GyroscopeOrientation) => {
        this.gyroscopeEventHandler(data);
      });
    console.log('Start gyroscope data collection');
  }

  private unwatchGyroscopeData() {
    this.unsubscribe(this.gyroscopeSubscription);
    console.log('Stop gyroscope data collection');
  }

  private unsubscribe(subscription: Subscription) {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  }
}
