import { BackgroundGeolocation, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { Injectable } from '@angular/core';
import { IPedometerData, Pedometer } from '@ionic-native/pedometer/ngx';
import { Gyroscope, GyroscopeOrientation, GyroscopeOptions } from '@ionic-native/gyroscope/ngx';
import { Subscription } from 'rxjs/Subscription';

import { CommService } from '../comm/comm.service'; 
import { ConfigService } from '../config/config.service';
import { DataService } from '../data/data.service';
import { RestService } from '../rest/rest.service';

import { ConfigEntity } from '../../entities/config.entity';
import { LocationEntity } from '../../entities/location.entity';
import { PedometerEntity } from '../../entities/pedometer.entity';
import { GyroscopeEntity } from '../../entities/gyroscope.entity';
import { IodoorDataEntity, StepsDataEntity } from '../../entities/daily-data.entity';
import { DatetimeService } from '../datetime/datetime.service';


const locationConfig = {
  desiredAccuracy: 0,
  stationaryRadius: 1,
  distanceFilter: 1,
  stopOnTerminate: false,
  debug: false,
  notificationTitle: 'Numbers Location Sensor',
  notificationText: 'Location data is being collected in background',
  activityType: 'AutomotiveNavigation',
  locationProvider: 0,
  interval: 1000,
  fastestInterval: 1000,
  activitiesInterval: 1000
}

const gyroOption: GyroscopeOptions = {
  frequency: 3000
}

@Injectable()
export class SensorService {
  locationSubscription: Subscription = null;
  pedometerSubscription: Subscription = null;
  stationarySubscription: Subscription = null;
  gyroscopeSubscription: Subscription = null;
  
  constructor(private commService: CommService,
              private configService: ConfigService,
              private dataService: DataService,
              private datetimeService: DatetimeService,
              private diagnostic: Diagnostic,
              private location: BackgroundGeolocation,
              private pedometer: Pedometer,
              private gyroscope: Gyroscope,
              private restService: RestService) {
                
  }

  configureLocationWatcher() {
    this.location.configure(locationConfig);
    this.locationSubscription = this.location.on(BackgroundGeolocationEvents.location).subscribe((data) => {
      this.locationEventHandler(data);
    });
    this.stationarySubscription = this.location.on(BackgroundGeolocationEvents.stationary).subscribe((data) => {
      this.locationEventHandler(data);
    });
    console.debug('Location Sensor configured');
  }

  async updateLocationSensorStatus(toggle: boolean = null) {
    if (toggle !== null) await this.configService.toggleLocationSensor(toggle);
    let status = await this.configService.isLocationSensorOn();
    status ? this.watchLocationData() : this.unwatchLocationData();
    this.dataService.addLocationStatus(status).then(res => {
      console.debug('locationStatus added: ', res);
    });
  }

  async updatePedometerSensorStatus(toggle: boolean = null) {
    if (toggle !== null) await this.configService.togglePedometerSensor(toggle);
    let status = await this.configService.isPedometerSensorOn();
    status ? this.watchPedometerData() : this.unwatchPedometerData();
    this.dataService.addPedometerStatus(status).then(res => {
      console.debug('pedometerStatus added: ', res);
    });
  }

  async updateGyroscopeSensorStatus(toggle: boolean = null) {
    if (toggle !== null) await this.configService.toggleGyroscopeSensor(toggle);
    (await this.configService.isGyroscopeSensorOn()) ? this.watchGyroscopeData() : this.unwatchGyroscopeData();
  }

  private createLocationEntity(data: BackgroundGeolocationResponse) {
    let locationEntity = new LocationEntity();
    locationEntity.dataTimestamp = new Date().getTime();
    Object.assign(locationEntity, data);
    return locationEntity;
  }

  private createPedometerEntity(data: IPedometerData) {
    let pedometerEntity = new PedometerEntity();
    pedometerEntity.dataTimestamp = new Date().getTime();
    Object.assign(pedometerEntity, data);
    return pedometerEntity;
  }

  private createGyroscopeEntity(data: GyroscopeOrientation) {
    let gyroscopeEntity = new GyroscopeEntity();
    gyroscopeEntity.dataTimestamp = data.timestamp;
    gyroscopeEntity.x = data.x;
    gyroscopeEntity.y = data.y;
    gyroscopeEntity.z = data.z;
    return gyroscopeEntity;
  }

  private locationEventHandler(data: BackgroundGeolocationResponse) {
    this.dataService.saveLocation(this.createLocationEntity(data))
    .then((res) => console.debug('Save location entity: ', res))
    .catch(e => console.log(e));
     
    this.dataService.getDailyIodoorData().then((iodoorData: IodoorDataEntity) => {
      this.dataService.saveIodoorData(iodoorData).catch(e => console.error(e));
      this.dataService.addIodoorMeta().then(() => {
        this.commService.sendIodoorMeta();
      }).catch(e => console.debug(e));
    }).catch(e => console.debug(e));
  }

  private pedometerEventHandler(data: IPedometerData) {
    this.dataService.savePedometer(this.createPedometerEntity(data))
    .then((res) => console.debug('Save pedometer entity: ', res))
    .catch(e => console.log(e));

    this.dataService.getDailyStepsData().then((stepsData: StepsDataEntity) => {
      this.dataService.saveStepsData(stepsData).catch(e => console.error(e));
      this.dataService.addStepsMeta().then(() => {
        this.commService.sendStepsMeta();
      }).catch(e => console.debug(e));
    }).catch(e => console.debug(e));
  }

  private gyroscopeEventHandler(data: GyroscopeOrientation) {
    console.log('Gyroscope data: ', data);
    this.dataService.saveGyroscope(this.createGyroscopeEntity(data))
    .then(res => console.debug('Save gyroscope entity: ', res))
    .catch(e => console.log(e));
    console.log('Gyroscope db: ', this.dataService.findGyroscope());
  }

  private watchLocationData(){
    this.location.start();
    console.debug('Start location data collection')
  }

  private unwatchLocationData(){
    this.location.stop();
    console.debug('Stop location data collection')
  }

  private watchPedometerData(){
    this.pedometerSubscription = this.pedometer.startPedometerUpdates()
    .subscribe((data: IPedometerData) => {
      this.pedometerEventHandler(data);
    });
    console.debug('Start pedometer data collection');
  }

  private unwatchPedometerData(){
    this.pedometer.stopPedometerUpdates();
    this.unsubscribe(this.pedometerSubscription);
    console.debug('Stop pedometer data collection');
  }

  private watchGyroscopeData(){
    this.gyroscopeSubscription = this.gyroscope.watch(gyroOption)
    .subscribe((data: GyroscopeOrientation) => {
      this.gyroscopeEventHandler(data);
    });
    console.debug('Start gyroscope data collection');
  }

  private unwatchGyroscopeData(){
    this.unsubscribe(this.gyroscopeSubscription);
    console.debug('Stop gyroscope data collection');
  }

  private unsubscribe(subscription: Subscription) {
    if (subscription !== null) {
      subscription.unsubscribe();
    }
  }

}
