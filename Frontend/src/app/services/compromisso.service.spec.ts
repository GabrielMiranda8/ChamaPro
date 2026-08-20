import { TestBed } from '@angular/core/testing';

import { CompromissoService } from './compromisso.service';

describe('CompromissoService', () => {
  let service: CompromissoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompromissoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
