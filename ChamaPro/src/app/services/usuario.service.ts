import { Injectable } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  salvar(usuario: UsuarioModel): UsuarioModel {
    let usuarios: UsuarioModel[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    if (usuario.id === '') {
      usuario.id = crypto.randomUUID();
      usuarios.push(usuario);
    } else {
      const posicao = usuarios.findIndex((temp) => temp.id === usuario.id);
      if (posicao >= 0) usuarios[posicao] = usuario;
    }
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return usuario;
  }

  autenticar(email: string, senha: string): boolean {
    const usuarios: UsuarioModel[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((temp) => temp.email === email);
    if (!usuario) return false;
    return senha === usuario.senha;
  }

  // Assinatura original mantida — login.page.ts não precisa mudar
  logar(usuario: UsuarioModel) {
    const usuarios: UsuarioModel[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const aux = usuarios.find((temp) => temp.email === usuario.email);
    if (aux && usuario.senha === aux.senha)
      localStorage.setItem('login', JSON.stringify(aux));
  }

  listar(): UsuarioModel[] {
    return JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

  buscarPorId(id: string): UsuarioModel {
    const usuarios: UsuarioModel[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    let usuario = new UsuarioModel();
    usuario = usuarios.find((temp) => temp.id === id) ?? usuario;
    return usuario;
  }

  getLogin(): UsuarioModel {
    const raw = localStorage.getItem('login');
    if (!raw) return new UsuarioModel();
    return JSON.parse(raw) as UsuarioModel;
  }

  excluirLogin(): boolean {
    localStorage.removeItem('login');
    return true;
  }

  
  atualizarLogado(campos: Partial<UsuarioModel>): UsuarioModel | null {
    const logado = this.getLogin();
    if (!logado.id) return null; // nenhum usuário logado
    const atualizado = { ...logado, ...campos };
    this.salvar(atualizado);
    localStorage.setItem('login', JSON.stringify(atualizado));
    return atualizado;
  }

  excluir(id: string): boolean {
    let usuarios: UsuarioModel[] = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const tamanhoAntes = usuarios.length;
    usuarios = usuarios.filter((temp) => temp.id !== id);
    if (usuarios.length === tamanhoAntes) return false;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    const logado = this.getLogin();
    if (logado.id === id) localStorage.removeItem('login');
    return true;
  }
}