export const dialogsSpy = jasmine.createSpyObj('Dialogs', {
  confirm: Promise.resolve(0)
});
