export const restServiceSpy = jasmine.createSpyObj('RestService', {
  getEmail: Promise.resolve(),
  getProfile: Promise.resolve(),
  getProfileSchema: Promise.resolve({}),
  quickLogin: Promise.resolve(),
  login: Promise.resolve(),
  signup: Promise.resolve(),
  patchProfile: Promise.resolve(),
  postEnvMeta: Promise.resolve(),
  postIodoorMeta: Promise.resolve(),
  postStepsMeta: Promise.resolve(),
  postLogin: Promise.resolve(),
});
