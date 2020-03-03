export const enum AirQualityDescriptor {
    GOOD = 'Good',
    MODERATE = 'Moderate',
    UNHEALTHY = 'Unhealthy',
    VERY_UNHEALTHY = 'Very Unhealthy',
    HAZARDOUS = 'Hazardous',
    UNKNOWN = 'Unknown',
  }

export interface AirQualityScale {
    level: number;
    descriptor: string;
}

export class AirQualityStatus implements AirQualityScale {
    level: number;
    descriptor: string;

    constructor(aqi: number) {
        this.setStatus(aqi);
    }

    setStatus(aqi: number) {
        if (aqi <= 50) {
            this.level = 5;
            this.descriptor = AirQualityDescriptor.GOOD;
        } else if (aqi <= 100) {
            this.level = 4;
            this.descriptor = AirQualityDescriptor.MODERATE;
        } else if (aqi <= 200) {
            this.level = 3;
            this.descriptor = AirQualityDescriptor.UNHEALTHY;
        } else if (aqi <= 300) {
            this.level = 2;
            this.descriptor = AirQualityDescriptor.VERY_UNHEALTHY;
        } else if (aqi > 300) {
            this.level = 1;
            this.descriptor = AirQualityDescriptor.HAZARDOUS;
        } else {
            this.level = null;
            this.descriptor = AirQualityDescriptor.UNKNOWN;
        }
    }
}

export interface LocationCoordinate {
    latitude: number;
    longitude: number;
}
