export const fileSpy = jasmine.createSpyObj('File', {
  checkFile: Promise.resolve(true),
  writeFile: Promise.resolve()
});

const properties = {
  dataDirectory: 'a-directory'
};

for (const [key, value] of Object.entries(properties)) {
  fileSpy[key] = value;
}
