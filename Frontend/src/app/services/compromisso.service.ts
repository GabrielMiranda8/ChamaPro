import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CompromissoModel } from '../model/compromisso.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class CompromissoService {
  private readonly API_URL = `${environment.apiUrl}/compromissos`;

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  buscarPorProfissionalEData(idProfissional: string, data: string): Observable<CompromissoModel[]> {
    return this.http.get<CompromissoModel[]>(
      `${this.API_URL}/profissional/${idProfissional}?data=${data}`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }

  buscarAgendaDoProfissional(idProfissional: string): Observable<CompromissoModel[]> {
    return this.http.get<CompromissoModel[]>(
      `${this.API_URL}/profissional/${idProfissional}/agenda`,
      { headers: this.tokenService.gerarCabecalhoAutenticacao() }
    );
  }
}