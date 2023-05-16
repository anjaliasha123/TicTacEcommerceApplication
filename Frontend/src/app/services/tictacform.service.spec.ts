import { TestBed } from '@angular/core/testing';

import { TictacformService } from './tictacform.service';

describe('TictacformService', () => {
  let service: TictacformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TictacformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
