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
    this.usuarioService.listar().subscribe({
      next: (profissionais) => {
        return profissionais.filter(u => u.tipo === 'PROFISSIONAL') as ProfissionalModel[];
      }
    });
    let p!: ProfissionalModel[];

    return p;
  }

  buscarPorId(id: string): ProfissionalModel {
    this.usuarioService.buscarPorId(id).subscribe({
      next: (profissional) => {
        return profissional  as ProfissionalModel;
      }
    });

    return new ProfissionalModel();
  }

  salvar(profissional: ProfissionalModel): ProfissionalModel {
    profissional.tipo = 'PROFISSIONAL';
    this.usuarioService.salvar(profissional).subscribe({
      next: (profissional) => {
        return profissional  as ProfissionalModel;
      }
    });
    let p!: ProfissionalModel;
    return p;
  }
}
