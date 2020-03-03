import { StepsDataEntity, IodoorDataEntity, SleepActivityEntity } from 'src/app/entities/daily-data.entity';

const fakeSevenNumberData = [0, 0, 0, 0, 0, 0, 0];

export const dataServiceSpy = jasmine.createSpyObj('DataService', {
  getDateWithAvailableData: Promise.resolve(['a-date']),
  generateSleepActivityData: Promise.resolve(),
  getDailyIodoorData: Promise.resolve(new IodoorDataEntity()),
  getDailySleepActivity: Promise.resolve(new SleepActivityEntity()),
  getDailyStepsData: Promise.resolve(new StepsDataEntity()),
  getAQIByDate: Promise.resolve([[]]),
  getIodoorByDate: Promise.resolve([[0]]),
  getJournalDataByDate: Promise.resolve([fakeSevenNumberData, fakeSevenNumberData]),
  getWeatherByDate: Promise.resolve([[]]),
  getSleepByDate: Promise.resolve([[]]),
  getStepsByDate: Promise.resolve([fakeSevenNumberData, fakeSevenNumberData]),
});
