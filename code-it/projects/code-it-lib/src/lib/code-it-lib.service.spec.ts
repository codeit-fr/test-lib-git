import { TestBed } from '@angular/core/testing';

import { CodeItLibService } from './code-it-lib.service';

describe('CodeItLibService', () => {
  let service: CodeItLibService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CodeItLibService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
