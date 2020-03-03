export const appVersionSpy = jasmine.createSpyObj('AppVersion', {
  getVersionNumber: Promise.resolve('a-version')
});
