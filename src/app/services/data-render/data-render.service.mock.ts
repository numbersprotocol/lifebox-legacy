import { AirQualityReport } from 'src/app/models/daily-report.model';

export const dataRenderServiceSpy = jasmine.createSpyObj('DataRenderService', {
  getAirQualityReportByDate: Promise.resolve({
    airQualityIndex: 'a-index',
    airQualityIndexDiff: 'a-index-diff',
    airQualityStatus: 'a-status',
  } as AirQualityReport),
});
