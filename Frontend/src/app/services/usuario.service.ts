import { Injectable } from '@angular/core';
import { UsuarioModel } from '../model/usuario.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly API_URL = `${environment.apiUrl}/usuarios`;
  private readonly AUTH_URL = `${environment.apiUrl}/auth`;


  /* LOCAL STORAGE --- LOCAL STORAGE

  atualizarLogado(campos: Partial<UsuarioModel>): UsuarioModel | null {
    const logado = this.getLogin();
    if (!logado.id) return null; // nenhum usuário logado
    const atualizado = { ...logado, ...campos };
    this.salvar(atualizado);
    localStorage.setItem('login', JSON.stringify(atualizado));
    return atualizado;
  }
  */

  // API -- API -- API ODILON
  constructor(private http: HttpClient, private tokenService: TokenService) { }



  /* NAO IMPLEMENTADO AINDA

  alterarSenha(id: string, senha: string): Observable<string> {
    return this.http.patch<string>(`${this.API_URL}/${id}/senha`, senha, { headers: this.tokenService.gerarCabecalhoAutenticacao() })
  check(email: string, senha: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.API_URL}/check`, { email, senha });
  }

  
    }
  

  */
  /* Público */
  /* Público */
login(email: string, senha: string): Observable<string> {
  return this.http.post<string>(
    `${this.AUTH_URL}/login`,
    { email, senha }
  );
}
  salvar(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.post<UsuarioModel>(`${this.API_URL}`, usuario);
  }

  logout(): void {
    this.tokenService.excluir();
  }

  getUsuarioLogado() {
    return this.tokenService.extrair();
  }

  criarProfissional(id: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/profissionais`, { id }, { headers: this.tokenService.gerarCabecalhoAutenticacao() });
  }

  
  /* Privado */
  buscarPorId(id: string): Observable<UsuarioModel> {
    return this.http.get<UsuarioModel>(`${this.API_URL}/${id}`, { headers: this.tokenService.gerarCabecalhoAutenticacao() });
  }

  listar(): Observable<UsuarioModel[]> {
    return this.http.get<UsuarioModel[]>(this.API_URL, { headers: this.tokenService.gerarCabecalhoAutenticacao() });
  }

  alterar(usuario: UsuarioModel): Observable<UsuarioModel> {
    return this.http.put<UsuarioModel>(`${this.API_URL}/${usuario.id}`, usuario, { headers: this.tokenService.gerarCabecalhoAutenticacao() });
  }
  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, { headers: this.tokenService.gerarCabecalhoAutenticacao() });
  }
}