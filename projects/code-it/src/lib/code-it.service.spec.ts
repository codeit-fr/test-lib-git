import { TestBed } from '@angular/core/testing';

import { CodeItService } from './code-it.service';

describe('CodeItService', () => {
  let service: CodeItService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeItService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
