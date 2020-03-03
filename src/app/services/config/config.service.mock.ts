export const configServiceSpy = jasmine.createSpyObj('ConfigService', {
  isInitialized: Promise.resolve(true),
  createConfig: Promise.resolve(),
  isLocationSensorOn: Promise.resolve(true),
  isPedometerSensorOn: Promise.resolve(true),
  isGyroscopeSensorOn: Promise.resolve(true)
});
