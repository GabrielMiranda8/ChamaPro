import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProfissionalServicoModel } from '../model/profissional-servico.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfissionalServicoService {
  private readonly API_URL = `${environment.apiUrl}/profissionalservico`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  // backend devolve servicoId/profissionalId (nomes diferentes do model)
  // alem de ja vir com servicoNome/profissionalNome prontos
  private converterData(ps: any): ProfissionalServicoModel {
    return {
      ...ps,
      idServico: ps.servicoId,
      idProfissional: ps.profissionalId,
      nomeServico: ps.servicoNome,
      tempoCarreira: ps.tempoCarreira ? new Date(ps.tempoCarreira) : new Date(),
    };
  }

  // ntes de enviar convertemos Date -> string (yyyy-MM-dd)
  private paraEnvio(ps: ProfissionalServicoModel): any {
    const data = ps.tempoCarreira instanceof Date
      ? ps.tempoCarreira.toISOString().split('T')[0]
      : ps.tempoCarreira;
    return { ...ps, tempoCarreira: data };
  }

  salvar(ps: ProfissionalServicoModel): Observable<ProfissionalServicoModel> {
    return this.http.post<ProfissionalServicoModel>(
      this.API_URL,
      this.paraEnvio(ps),
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    ).pipe(map(res => this.converterData(res)));
  }

  listar(): Observable<ProfissionalServicoModel[]> {
    return this.http.get<ProfissionalServicoModel[]>(
      this.API_URL,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    ).pipe(map(res => res.map(ps => this.converterData(ps))));
  }

  buscarPorId(id: string): Observable<ProfissionalServicoModel> {
    return this.http.get<ProfissionalServicoModel>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    ).pipe(map(res => this.converterData(res)));
  }

  buscarPorProfissional(idProfissional: string): Observable<ProfissionalServicoModel[]> {
    return this.http.get<ProfissionalServicoModel[]>(
      `${this.API_URL}/profissional/${idProfissional}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    ).pipe(map(res => res.map(ps => this.converterData(ps))));
  }

  excluir(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/${id}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  excluirPorProfissionalServico(idProfissional: string, idServico: string): Observable<void> {
    return this.http.delete<void>(
      `${this.API_URL}/profissional/${idProfissional}/servico/${idServico}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
}