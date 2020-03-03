export const sensorServiceSpy = jasmine.createSpyObj('SensorService', {
  configureLocationWatcher: undefined,
  updateLocationSensorStatus: Promise.resolve(),
  updatePedometerSensorStatus: Promise.resolve(),
  updateGyroscopeSensorStatus: Promise.resolve()
});
