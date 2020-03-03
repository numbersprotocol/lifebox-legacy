import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NavController } from '@ionic/angular';
import { navControllerSpy } from '../../../mocks/angular/nav-controller';

import { ConfigService } from '../../services/config/config.service';
import { configServiceSpy } from '../../services/config/config.service.mock';
import { SensorService } from '../../services/sensor/sensor.service';
import { sensorServiceSpy } from '../../services/sensor/sensor.service.mock';

import { ControlCenterPage } from './control-center.page';

describe('ControlCenterPage', () => {
  let component: ControlCenterPage;
  let fixture: ComponentFixture<ControlCenterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlCenterPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: SensorService, useValue: sensorServiceSpy }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlCenterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
