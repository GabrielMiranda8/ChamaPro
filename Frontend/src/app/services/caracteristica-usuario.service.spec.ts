import { TestBed } from '@angular/core/testing';

import { CaracteristicaUsuarioService } from './caracteristica-usuario.service';

describe('CaracteristicaUsuarioService', () => {
  let service: CaracteristicaUsuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaracteristicaUsuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
