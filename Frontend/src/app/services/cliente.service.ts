import { Injectable } from '@angular/core';
import { ClienteModel } from '../model/cliente.model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private usuarioService: UsuarioService) {

   }

  listar(): ClienteModel[] {
    return this.usuarioService.listar().filter(u => u.tipo === 'CLIENTE') as ClienteModel[];
  }

  buscarPorId(id: string): ClienteModel {
    return this.usuarioService.buscarPorId(id) as ClienteModel;
  }

  salvar(cliente: ClienteModel): ClienteModel {
    cliente.tipo = 'CLIENTE';
    return this.usuarioService.salvar(cliente) as ClienteModel;
  }
}
