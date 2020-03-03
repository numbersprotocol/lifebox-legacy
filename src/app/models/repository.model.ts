import { createConnection, getRepository, Repository } from 'typeorm';
import { CordovaConnectionOptions } from 'typeorm/driver/cordova/CordovaConnectionOptions';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';

import { AirQualityEntity } from 'src/app/entities/airquality.entity';
import { ConfigEntity } from 'src/app/entities/config.entity';
import { CustomClassEntity } from 'src/app/entities/customClass.entity';
import { CustomClassRecordEntity } from 'src/app/entities/customClassRecord.entity';
import { EnvMetaEntity, IodoorMetaEntity, StepsMetaEntity } from 'src/app/entities/metadata.entity';
import { IodoorDataEntity, SleepActivityEntity, StepsDataEntity } from 'src/app/entities/daily-data.entity';
import { LocationEntity } from 'src/app/entities/location.entity';
import { PedometerEntity } from 'src/app/entities/pedometer.entity';
import { GyroscopeEntity } from 'src/app/entities/gyroscope.entity';
import { WeatherEntity } from 'src/app/entities/weather.entity';
import { LocationStatusEntity, PedometerStatusEntity } from 'src/app/entities/sensor-status.entity';
import { LogEntity } from '../entities/log.entity';

const cordovaConnectionOptions: CordovaConnectionOptions = {
    type: 'cordova',
    database: 'lifebox.db',
    location: 'default',
    logging: ['error', 'schema'],
    synchronize: true,
    entities: [
      AirQualityEntity, ConfigEntity, CustomClassEntity, CustomClassRecordEntity, EnvMetaEntity,
      GyroscopeEntity, IodoorDataEntity, IodoorMetaEntity, LocationEntity, LocationStatusEntity,
      PedometerEntity, PedometerStatusEntity, StepsDataEntity, StepsMetaEntity, SleepActivityEntity,
      WeatherEntity, LogEntity
    ]
  };

const sqljsConnectionOptions: SqljsConnectionOptions = {
    type: 'sqljs',
    location: 'default',
    logging: ['error', 'schema'],
    synchronize: true,
    entities: [
        AirQualityEntity, ConfigEntity, CustomClassEntity, CustomClassRecordEntity, EnvMetaEntity,
        GyroscopeEntity, IodoorDataEntity, IodoorMetaEntity, LocationEntity, LocationStatusEntity,
        PedometerEntity, PedometerStatusEntity, StepsDataEntity, StepsMetaEntity, SleepActivityEntity,
        WeatherEntity, LogEntity
    ]
};

export const enum RepoName {
    CONFIG = 'config',
    LOCATION = 'location',
    PEDOMETER = 'pedometer',
    GYROSCOPE = 'gyroscope',
    ENVMETA = 'envMeta',
    IODOORDATA = 'iodoorData',
    IODOORMETA = 'iodoorMeta',
    STEPSDATA = 'stepsData',
    STEPSMETA = 'stepsMeta',
    SLEEPACTIVITY = 'sleepActivity',
    WEATHER = 'weather',
    AIRQUALITY = 'airquality',
    LOCATIONSTATUS = 'locationStatus',
    PEDOMETERSTATUS = 'pedometerStatus',
    CUSTOMCLASS = 'customClass',
    CUSTOMCLASSRECORD = 'customClassRecord',
    LOG = 'log',
}

export class Repo {
    airQuality: Repository<AirQualityEntity>;
    config: Repository<ConfigEntity>;
    customClass: Repository<CustomClassEntity>;
    customClassRecord: Repository<CustomClassRecordEntity>;
    envMeta: Repository<EnvMetaEntity>;
    iodoorData: Repository<IodoorDataEntity>;
    iodoorMeta: Repository<IodoorMetaEntity>;
    gyroscope: Repository<GyroscopeEntity>;
    location: Repository<LocationEntity>;
    locationStatus: Repository<LocationStatusEntity>;
    log: Repository<LogEntity>;
    pedometer: Repository<PedometerEntity>;
    pedometerStatus: Repository<PedometerStatusEntity>;
    stepsData: Repository<StepsDataEntity>;
    stepsMeta: Repository<StepsMetaEntity>;
    sleepActivity: Repository<SleepActivityEntity>;
    weather: Repository<WeatherEntity>;

    constructor() {
    }

    async initCordovaConnection() {
        return createConnection(cordovaConnectionOptions)
        .then(connection => {
            this.getRepo();
            return Promise.resolve(connection);
        });
    }

    async initSqljsConnection() {
        return createConnection(sqljsConnectionOptions)
        .then(connection => {
            this.getRepo();
            return Promise.resolve(connection);
        });
    }

    private getRepo() {
        this.config = getRepository(RepoName.CONFIG) as Repository<ConfigEntity>;
        this.location = getRepository(RepoName.LOCATION) as Repository<LocationEntity>;
        this.pedometer = getRepository(RepoName.PEDOMETER) as Repository<PedometerEntity>;
        this.gyroscope = getRepository(RepoName.GYROSCOPE) as Repository<GyroscopeEntity>;
        this.envMeta = getRepository(RepoName.ENVMETA) as Repository<EnvMetaEntity>;
        this.iodoorData = getRepository(RepoName.IODOORDATA) as Repository<IodoorDataEntity>;
        this.iodoorMeta = getRepository(RepoName.IODOORMETA) as Repository<IodoorMetaEntity>;
        this.stepsData = getRepository(RepoName.STEPSDATA) as Repository<StepsDataEntity>;
        this.stepsMeta = getRepository(RepoName.STEPSMETA) as Repository<StepsMetaEntity>;
        this.sleepActivity = getRepository(RepoName.SLEEPACTIVITY) as Repository<SleepActivityEntity>;
        this.weather = getRepository(RepoName.WEATHER) as Repository<WeatherEntity>;
        this.airQuality = getRepository(RepoName.AIRQUALITY) as Repository<AirQualityEntity>;
        this.locationStatus = getRepository(RepoName.LOCATIONSTATUS) as Repository<LocationStatusEntity>;
        this.pedometerStatus = getRepository(RepoName.PEDOMETERSTATUS) as Repository<PedometerStatusEntity>;
        this.customClass = getRepository(RepoName.CUSTOMCLASS) as Repository<CustomClassEntity>;
        this.customClassRecord = getRepository(RepoName.CUSTOMCLASSRECORD) as Repository<CustomClassRecordEntity>;
        this.log = getRepository(RepoName.LOG) as Repository<LogEntity>;
    }

}

