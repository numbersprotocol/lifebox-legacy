export const platformSpy = jasmine.createSpyObj('Platform', {
  ready: Promise.resolve()
});
