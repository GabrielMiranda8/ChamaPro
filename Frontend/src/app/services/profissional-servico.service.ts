import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProfissionalServicoModel } from '../model/profissional-servico.model';
import { TokenService } from './token.service';

export interface ProfissionalServicoResponse {
  id: string;
  servicoId: string;
  servicoNome: string;
  profissionalId: string;
  profissionalNome: string;
  preco: number;
  tempoCarreira: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ProfissionalServicoService {
  private readonly API_URL = `${environment.apiUrl}/profissionalservicos`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  salvar(ps: ProfissionalServicoModel): Observable<ProfissionalServicoResponse> {
    const body = {
      idServico: ps.idServico,
      idProfissional: ps.idProfissional,
      preco: ps.preco,
      tempoCarreira: ps.tempoCarreira,
    };

    if (ps.id) {
      return this.http.put<ProfissionalServicoResponse>(`${this.API_URL}/${ps.id}`, body, {
        headers: this.tokenService.gerarCabecalhoAutenticacao(),
      });
    }

    return this.http.post<ProfissionalServicoResponse>(this.API_URL, body, {
      headers: this.tokenService.gerarCabecalhoAutenticacao(),
    });
  }

  listar(): Observable<ProfissionalServicoResponse[]> {
    return this.http.get<ProfissionalServicoResponse[]>(this.API_URL, {
      headers: this.tokenService.gerarCabecalhoAutenticacao(),
    });
  }

  buscarPorId(id: string): Observable<ProfissionalServicoResponse> {
    return this.http.get<ProfissionalServicoResponse>(`${this.API_URL}/${id}`, {
      headers: this.tokenService.gerarCabecalhoAutenticacao(),
    });
  }

  buscarPorProfissional(idProfissional: string): Observable<ProfissionalServicoResponse[]> {
    return this.http.get<ProfissionalServicoResponse[]>(`${this.API_URL}/profissional/${idProfissional}`, {
      headers: this.tokenService.gerarCabecalhoAutenticacao(),
    });
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`, {
      headers: this.tokenService.gerarCabecalhoAutenticacao(),
    });
  }

  excluirPorProfissionalServico(idProfissional: string, idServico: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/profissional/${idProfissional}/servico/${idServico}`, {
      headers: this.tokenService.gerarCabecalhoAutenticacao(),
    });
  }
}
