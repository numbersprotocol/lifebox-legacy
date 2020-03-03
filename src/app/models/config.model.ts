export interface Config {
    language: string;
    sensors: {
        location: boolean;
        pedometer: boolean;
        gyroscope: boolean;
    };
}
