import { Injectable } from '@angular/core';
import { ProfissionalModel } from '../model/profissional.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {
    constructor(private usuarioService: UsuarioService) {

    }

  listar(): ProfissionalModel[] {
    return this.usuarioService.listar().filter(u => u.tipo === 'PROFISSIONAL') as ProfissionalModel[];
  }

  buscarPorId(id: string): ProfissionalModel {
    return this.usuarioService.buscarPorId(id) as ProfissionalModel;
  }

  salvar(profissional: ProfissionalModel): ProfissionalModel {
    profissional.tipo = 'PROFISSIONAL';
    return this.usuarioService.salvar(profissional) as ProfissionalModel;
  }
}
