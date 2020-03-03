import { CustomClassEntity } from '../entities/customClass.entity';

export const enum DISPLAY {
  NO_DATA = '- -',
  NO_CLOCK_DATA = '- - : - -',
  NOT_AVAILABLE = 'N/A',
  HIGHER = 'Higher',
  LOWER = 'Lower',
}

export class DailyReport {
  airQuality: AirQualityReport;
  customClass: CustomClassReport;
  iodoor: IodoorReport;
  steps: StepsReport;
  sleepActivity: SleepActivityReport;
  weather: WeatherReport;

  constructor() {
    this.setAllAsDefault();
  }

  getAirQuality() {
    return this.airQuality;
  }

  getCustomClass() {
    return this.customClass;
  }

  getIodoor() {
    return this.iodoor;
  }

  getSleepActivity() {
    return this.sleepActivity;
  }

  getSteps() {
    return this.steps;
  }

  getWeather() {
    return this.weather;
  }

  setAllAsDefault() {
    this.setDefaultAirQuality();
    this.setDefaultCustomClass();
    this.setDefaultIodoor();
    this.setDefaultSleepActivity();
    this.setDefaultSteps();
    this.setDefaultWeather();
  }

  setAirQuality(airQuality: AirQualityReport) {
    this.airQuality = airQuality;
  }

  setCustomClass(customClass: CustomClassReport) {
    this.customClass = customClass;
  }

  setIodoor(iodoor: IodoorReport) {
    this.iodoor = iodoor;
  }

  setSleepActivity(sleepActivity: SleepActivityReport) {
    this.sleepActivity = sleepActivity;
  }

  setSteps(steps: StepsReport) {
    this.steps = steps;
  }

  setWeather(weather: WeatherReport) {
    this.weather = weather;
  }

  private setDefaultAirQuality() {
    this.airQuality = {
      airQualityIndex: DISPLAY.NO_DATA,
      airQualityIndexDiff: DISPLAY.NOT_AVAILABLE,
      airQualityStatus: DISPLAY.NO_DATA,
    };
  }

  private setDefaultCustomClass() {
    this.customClass = {
      classes: [],
    };
  }

  private setDefaultIodoor() {
    this.iodoor = {
      indoorPercent: DISPLAY.NO_DATA,
      indoorPercentDiff: DISPLAY.NOT_AVAILABLE,
      outdoorPercent: DISPLAY.NO_DATA,
      outdoorPercentDiff: DISPLAY.NOT_AVAILABLE,
    };
  }

  private setDefaultSleepActivity() {
    this.sleepActivity = {
      sleepTime: DISPLAY.NO_DATA,
      sleepTimeDiff: DISPLAY.NOT_AVAILABLE,
      wokeupTime: DISPLAY.NO_CLOCK_DATA,
      wokeupTimeDiff: DISPLAY.NOT_AVAILABLE,
    };
  }

  private setDefaultSteps() {
    this.steps = {
      steps: DISPLAY.NO_DATA,
      stepsDiff: DISPLAY.NOT_AVAILABLE,
    };
  }

  private setDefaultWeather() {
    this.weather = {
      weatherTempCelsius: DISPLAY.NO_DATA,
      weatherTempCelsiusDiff: DISPLAY.NOT_AVAILABLE,
      weatherHumidity: DISPLAY.NO_DATA,
      weatherHumidityDiff: DISPLAY.NOT_AVAILABLE,
    };
  }
}

export interface AirQualityReport {
  airQualityIndex: string;
  airQualityIndexDiff: string;
  airQualityStatus: string;
}

export interface IodoorReport {
  indoorPercent: string;
  indoorPercentDiff: string;
  outdoorPercent: string;
  outdoorPercentDiff: string;
}

export interface StepsReport {
  steps: string;
  stepsDiff: string;
}

export interface SleepActivityReport {
  sleepTime: string;
  sleepTimeDiff: string;
  wokeupTime: string;
  wokeupTimeDiff: string;
}
export interface WeatherReport {
  weatherTempCelsius: string;
  weatherTempCelsiusDiff: string;
  weatherHumidity: string;
  weatherHumidityDiff: string;
}

export interface CustomClassReport {
  classes: Array<CustomClassEntity>;
}
