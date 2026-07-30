import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfissionalModel } from '../model/profissional.model';
import { TokenService } from './token.service';

// Endpoint próprio /profissionais no backend (ProfissionalController).
// O ProfissionalResponseDTO só traz campos não sensíveis (nome, dtNasc,
// dtConta, nota, tipo) — não o objeto UsuarioModel completo.
@Injectable({
  providedIn: 'root',
})
export class ProfissionalService {
  private readonly API_URL = `${environment.apiUrl}/profissionais`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  listar(): Observable<ProfissionalModel[]> {
    return this.http.get<ProfissionalModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  buscarPorId(id: string): Observable<ProfissionalModel> {
    return this.http.get<ProfissionalModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  criar(id: string): Observable<ProfissionalModel> {
    return this.http.post<ProfissionalModel>(
      this.API_URL,
      { id },
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  atualizar(id: string): Observable<ProfissionalModel> {
    return this.http.put<ProfissionalModel>(
      `${this.API_URL}/${id}`,
      { id },
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() },
    );
  }
}
