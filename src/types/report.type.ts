export interface AirQualityReport {
    airQualityIndex: number;
    airQualityIndexDiff: string;
    airQualityStatus: string;
  }
  
  export interface IodoorReport {
    indoorPercent: string;
    outdoorPercent: string;
  }
  
  export interface SleepActivityReport {
    sleepTime: string;
    wokeupTime: string;
  }
  export interface WeatherReport {
    weatherTempCelsius: number;
    weatherTempCelsiusDiff: string;
    weatherHumidity: number;
    weatherHumidityDiff: string;
  }