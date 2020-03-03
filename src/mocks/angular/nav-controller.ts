export const navControllerSpy = jasmine.createSpyObj('NavController', {
  navigateForward: Promise.resolve(true),
  navigateBack: Promise.resolve(true),
  navigateRoot: Promise.resolve(true)
});
