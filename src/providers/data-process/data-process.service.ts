import { Injectable } from '@angular/core';

import { DatetimeService } from '../datetime/datetime.service';

import { PedometerEntity } from '../../entities/pedometer.entity';
import { SleepActivityEntity, IodoorDataEntity, StepsDataEntity } from '../../entities/daily-data.entity';
import { LocationEntity } from '../../entities/location.entity';

@Injectable()
export class DataProcessService {

  constructor(private datetimeService: DatetimeService) {

  }

  computeIodoor(locationEntites: Array<LocationEntity>, date: Date = null): IodoorDataEntity {
    if (!date) date = new Date();
    let iodoorDataEntity = new IodoorDataEntity();
    iodoorDataEntity.dateString = this.datetimeService.timeToDateString(date);

    for (let i = 1; i < locationEntites.length; i++) {
      let timeDiff = locationEntites[i].dataTimestamp - locationEntites[i-1].dataTimestamp;
      let frontScore = locationEntites[i].isIndoor();
      let backScore = locationEntites[i-1].isIndoor();
      let indoorScore = timeDiff > 600000? frontScore + backScore + 1 :
                                           frontScore + backScore;

      if (indoorScore > 0) {
        iodoorDataEntity.addIndoorTime(timeDiff)
      }
      else if (indoorScore == 0) {
        if ((frontScore != 0) || (backScore != 0)){
          iodoorDataEntity.addIndoorTime(timeDiff / 2);
          iodoorDataEntity.addOutdoorTime(timeDiff / 2);
        }
      }
      else {
        iodoorDataEntity.addOutdoorTime(timeDiff);
      }
    }
    return iodoorDataEntity;
  }

  computeSleepActivity(pedometerEntities: Array<PedometerEntity>, date: Date = null): SleepActivityEntity {
    if (!date) date = new Date();
    let sleepActivityEntity = new SleepActivityEntity();
    sleepActivityEntity.dateString = this.datetimeService.timeToDateString(date);

    if (pedometerEntities.length <= 1) return sleepActivityEntity;

    let sleepCheckPoint = new Date(date).setHours(4, 0, 0, 0);

    if (pedometerEntities[0].dataTimestamp > sleepCheckPoint) return sleepActivityEntity;

    for (let i = 1; i < pedometerEntities.length; i++){
      if (pedometerEntities[i].dataTimestamp >= sleepCheckPoint) {
        sleepActivityEntity.setWokeupTime(pedometerEntities[i].dataTimestamp);
        sleepActivityEntity.setSleepTime(pedometerEntities[i-1].dataTimestamp);
        return sleepActivityEntity;
      }
    }

    return sleepActivityEntity;

  }

  computeSteps(pedometerEntities: Array<PedometerEntity>, date: Date = null): StepsDataEntity {
    if (!date) date = new Date();
    let stepsDataEntity = new StepsDataEntity();
    stepsDataEntity.dateString = this.datetimeService.timeToDateString(date);

    for (let i = 1; i < pedometerEntities.length; i++) {
      let stepsDiff = pedometerEntities[i].numberOfSteps - pedometerEntities[i-1].numberOfSteps
      if (stepsDiff > 0) stepsDataEntity.addSteps(stepsDiff);
    }
    return stepsDataEntity;
  }

}
