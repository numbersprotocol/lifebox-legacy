import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { NavController } from '@ionic/angular';
import { navControllerSpy } from '../../../mocks/angular/nav-controller';

import { HomePage } from './home.page';
import { DataService } from '../../services/data/data.service';
import { dataServiceSpy } from '../../services/data/data.service.mock';
import { DataRenderService } from '../../services/data-render/data-render.service';
import { dataRenderServiceSpy } from '../../services/data-render/data-render.service.mock';
import { SensorService } from '../../services/sensor/sensor.service';
import { sensorServiceSpy } from '../../services/sensor/sensor.service.mock';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: DataService, useValue: dataServiceSpy },
        { provide: DataRenderService, useValue: dataRenderServiceSpy },
        { provide: SensorService, useValue: sensorServiceSpy },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
