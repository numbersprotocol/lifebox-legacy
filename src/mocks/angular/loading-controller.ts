export const loadingControllerSpy = jasmine.createSpyObj('LoadingController', {
  create: Promise.resolve(jasmine.createSpyObj('HTMLIonLoadingElement', {
    present: Promise.resolve()
  })),
  dismiss: Promise.resolve(true)
});
