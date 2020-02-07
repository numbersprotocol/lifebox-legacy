import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../home/home';

import { ConfigEntity } from '../../entities/config.entity';
import { ConfigService } from '../../providers/config/config.service';
import { SensorService } from '../../providers/sensor/sensor.service';
import { Repository, getRepository } from 'typeorm';
import { CustomClassEntity } from '../../entities/customClass.entity';
import { TabsControllerPage } from '../tabs-controller/tabs-controller';
import { CustomClassRecordEntity } from '../../entities/customClassRecord.entity';
@Component({
  selector: 'page-control-center',
  templateUrl: 'control-center.html'
})
export class ControlCenterPage {
  locationEnabled: boolean;
  pedometerEnabled: boolean;
  gyroscopeEnabled: boolean;

  customClassRepo: Repository<CustomClassEntity>;
  customClasses: any; 
  customClassRecordRepo: Repository<CustomClassRecordEntity>;

  constructor(public navCtrl: NavController,
              public configService: ConfigService,
              public sensorService: SensorService) {

  }

  async ionViewWillEnter() {
    this.locationEnabled = await this.configService.isLocationSensorOn();
    this.pedometerEnabled = await this.configService.isPedometerSensorOn();
    this.gyroscopeEnabled = await this.configService.isGyroscopeSensorOn();
    this.customClasses = await this.customClassRepo
    .createQueryBuilder('customClass')
    .leftJoinAndSelect(
      'customClass.records',
      'custom_class_record_entity'
    )
    .orderBy('custom_class_record_entity_id', 'DESC')
    .getMany()
    .catch(err => {
      console.log(err);
    })
  }
  
  ngOnInit() {
    return new Promise((resolve, rejects) => {
      this.customClassRepo = getRepository(CustomClassEntity);
      this.customClassRecordRepo = getRepository(CustomClassRecordEntity);
      resolve(true);
    });
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

  update(params) {
    console.log('customClasses: ', this.customClasses);
    let updates = [];
    this.customClasses.forEach(async element => {
      updates.push(this.customClassRepo.save(element));
      updates.push(this.customClassRecordRepo.save(element.records));
    });
    Promise.all(updates)
    .then(_ => {
      if (!params) params = {};                                                   
      this.navCtrl.push(TabsControllerPage);                                        
    })
    .catch(err => {
      console.log(err);
    })
  }
  goToHome(params){                                                    
    if (!params) params = {};                                                   
    this.navCtrl.push(HomePage);                                        
  }
  
}
