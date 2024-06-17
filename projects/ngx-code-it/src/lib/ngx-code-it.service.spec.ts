import { TestBed } from '@angular/core/testing';

import { NgxCodeItService } from './ngx-code-it.service';

describe('NgxCodeItService', () => {
  let service: NgxCodeItService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCodeItService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
