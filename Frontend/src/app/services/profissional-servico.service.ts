import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfissionalServicoModel } from '../model/profissional-servico.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalServicoService {
  private readonly API_URL = `${environment.apiUrl}/profissional-servicos`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  salvar(ps: ProfissionalServicoModel): Observable<ProfissionalServicoModel> {
    return this.http.post<ProfissionalServicoModel>(
      this.API_URL,
      ps,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  listar(): Observable<ProfissionalServicoModel[]> {
    return this.http.get<ProfissionalServicoModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorId(id: string): Observable<ProfissionalServicoModel> {
    return this.http.get<ProfissionalServicoModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarPorProfissional(idProfissional: string): Observable<ProfissionalServicoModel[]> {
    return this.http.get<ProfissionalServicoModel[]>(
      `${this.API_URL}/profissional/${idProfissional}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
}
