import { TestBed } from '@angular/core/testing';

import { CaracteristicaService } from './caracteristica.service';

describe('CaracteristicaService', () => {
  let service: CaracteristicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaracteristicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
