import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { File } from '@ionic-native/file/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Gyroscope } from '@ionic-native/gyroscope/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';

import { SensorService } from './sensor.service';

describe('SensorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [
      BackgroundGeolocation,
      Diagnostic,
      File,
      HTTP,
      Gyroscope,
      Pedometer]
  }));

  it('should be created', () => {
    const service: SensorService = TestBed.get(SensorService);
    expect(service).toBeTruthy();
  });
});
