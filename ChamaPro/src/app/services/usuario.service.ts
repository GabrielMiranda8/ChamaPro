import { Injectable } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  salvar(usuario: UsuarioModel): UsuarioModel {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuario.id === "") {
      usuario.id = crypto.randomUUID();
      usuarios.push(usuario);
    } else {
      let posicao = usuarios.findIndex((temp: UsuarioModel) => temp.id === usuario.id);
      usuarios[posicao] = usuario;
    }
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return usuario;
  }

  autenticar(email: string, senha: string): boolean {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let usuario = new UsuarioModel();
    usuario = usuarios.find((temp: UsuarioModel) => temp.email === email);
    if (!usuario)
      return false;
    if (senha === usuario.senha)
      return true;
    return false;
  }

  logar(usuario: UsuarioModel) {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let aux = new UsuarioModel();
    aux = usuarios.find((temp: UsuarioModel) => temp.email === usuario.email);
    if (aux && usuario.senha === aux.senha)
      localStorage.setItem('login', JSON.stringify(aux));
  }

  listar(): UsuarioModel[] {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    return usuarios;
  }

  buscarPorId(id: string): UsuarioModel {
    let usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let usuario = new UsuarioModel();
    usuario = usuarios.find((temp: UsuarioModel) => temp.id === id);
    return usuario;
  }

  getLogin(): UsuarioModel {
    let usuario = JSON.parse(localStorage.getItem('login') || '[]');
    return usuario;
  }

  excluirLogin() {
    localStorage.removeItem('login');
    return true;
  }
}
