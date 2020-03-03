import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { HTTP } from '@ionic-native/http/ngx';
import { File } from '@ionic-native/file/ngx';

import { CommService } from './comm.service';

describe('CommService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [File, HTTP]
  }));

  it('should be created', () => {
    const service: CommService = TestBed.get(CommService);
    expect(service).toBeTruthy();
  });
});
