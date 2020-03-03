export const imagePickerSpy = jasmine.createSpyObj('ImagePicker', {
  getPictures: Promise.resolve()
});
