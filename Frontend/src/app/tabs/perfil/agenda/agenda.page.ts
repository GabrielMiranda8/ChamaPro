import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, chevronBackOutline, chevronForwardOutline, calendarClearOutline } from 'ionicons/icons';

import { CompromissoService } from 'src/app/services/compromisso.service';
import { TokenService } from 'src/app/services/token.service';
import { CompromissoModel } from 'src/app/model/compromisso.model';

const ALTURA_HORA = 48; // altura em pixels de cada linha de 1h na grade
const DIAS_SEMANA = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.'];

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon, IonButton, IonSpinner],
})
export class AgendaPage implements OnInit {

  compromissos: CompromissoModel[] = [];
  carregando = false;
  selecionado: CompromissoModel | null = null;

  weekStart!: Date;
  dias: Date[] = [];
  horas: number[] = [];
  alturaHora = ALTURA_HORA;
  diasSemanaLabel = DIAS_SEMANA;
  mesLabel = '';
  hojeIso = '';

  constructor(
    private compromissoService: CompromissoService,
    private tokenService: TokenService,
  ) {
    addIcons({ arrowBackOutline, chevronBackOutline, chevronForwardOutline, calendarClearOutline });
  }

  ngOnInit(): void {
    this.horas = [];
    for (let h = 0; h < 24; h++) {
      this.horas.push(h);
    }

    this.hojeIso = this.formatarIso(new Date());
    this.weekStart = this.obterInicioSemana(new Date());
    this.atualizarDiasEMes();
    this.carregarAgenda();
  }

  // ─── Semana / dias ───────────────────────────────────────────────────────

  private obterInicioSemana(data: Date): Date {
    const resultado = new Date(data);
    resultado.setHours(0, 0, 0, 0);
    resultado.setDate(resultado.getDate() - resultado.getDay());
    return resultado;
  }

  private atualizarDiasEMes(): void {
    const dias: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const dia = new Date(this.weekStart);
      dia.setDate(dia.getDate() + i);
      dias.push(dia);
    }
    this.dias = dias;

    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diaCentral = dias[3]; // quarta-feira da semana, pra decidir o mês exibido
    this.mesLabel = `${meses[diaCentral.getMonth()]} de ${diaCentral.getFullYear()}`;
  }

  irParaHoje(): void {
    this.weekStart = this.obterInicioSemana(new Date());
    this.atualizarDiasEMes();
  }

  mudarSemana(quantidade: number): void {
    const novaData = new Date(this.weekStart);
    novaData.setDate(novaData.getDate() + quantidade * 7);
    this.weekStart = novaData;
    this.atualizarDiasEMes();
  }

  formatarIso(data: Date): string {
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const dia = data.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  }

  // ─── Carregamento ────────────────────────────────────────────────────────

  private carregarAgenda(): void {
    const token = this.tokenService.extrair();
    this.carregando = true;

    this.compromissoService.buscarAgendaDoProfissional(token.id).subscribe({
      next: (lista) => {
        this.compromissos = lista;
        this.carregando = false;
      },
      error: (err) => {
        console.log('Erro ao carregar agenda: ', err);
        this.carregando = false;
      }
    });
  }

  // ─── Eventos na grade ────────────────────────────────────────────────────

  // Um compromisso agora pode durar vários dias (dataInicio até dataFim).
  // Por isso ele precisa aparecer em TODOS os dias da grade que caem
  // dentro desse período, não só num dia exato.
  eventosPorDia(diaIso: string): CompromissoModel[] {
    const lista: CompromissoModel[] = [];
    for (let i = 0; i < this.compromissos.length; i++) {
      const c = this.compromissos[i];
      if (diaIso >= c.dataInicio && diaIso <= c.dataFim) {
        lista.push(c);
      }
    }
    return lista;
  }

  calcularTopo(horaInicio: string): number {
    const partes = horaInicio.split(':');
    const hora = Number(partes[0]);
    const minuto = Number(partes[1]);
    return (hora + minuto / 60) * this.alturaHora;
  }

  calcularAltura(horaInicio: string, horaFim: string): number {
    const inicioPartes = horaInicio.split(':');
    const fimPartes = horaFim.split(':');

    const inicioMinutos = Number(inicioPartes[0]) * 60 + Number(inicioPartes[1]);
    const fimMinutos = Number(fimPartes[0]) * 60 + Number(fimPartes[1]);
    const duracaoMinutos = fimMinutos - inicioMinutos;

    const altura = (duracaoMinutos / 60) * this.alturaHora - 4;
    if (altura < 22) {
      return 22;
    }
    return altura;
  }

  // ─── Lista "Próximos serviços" ──────────────────────────────────────────
  // Um serviço continua relevante enquanto ainda não passou da dataFim —
  // isso cobre tanto compromissos futuros quanto os que já começaram mas
  // ainda estão "em andamento" (ex: uma semana de trabalho que começou ontem).

  get proximosServicos(): CompromissoModel[] {
    const lista: CompromissoModel[] = [];
    for (let i = 0; i < this.compromissos.length; i++) {
      if (this.compromissos[i].dataFim >= this.hojeIso) {
        lista.push(this.compromissos[i]);
      }
    }

    // ordena por dataInicio + hora (bubble sort, mesmo padrão já usado no projeto)
    for (let i = 0; i < lista.length - 1; i++) {
      for (let j = 0; j < lista.length - 1 - i; j++) {
        const chaveA = lista[j].dataInicio + lista[j].horaInicio;
        const chaveB = lista[j + 1].dataInicio + lista[j + 1].horaInicio;
        if (chaveA > chaveB) {
          const temp = lista[j];
          lista[j] = lista[j + 1];
          lista[j + 1] = temp;
        }
      }
    }
    return lista;
  }

  formatarDataBr(dataIso: string): string {
    const partes = dataIso.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  // Mostra "12/09" ou, se for um período de vários dias, "12/09 – 19/09"
  formatarPeriodoBr(c: CompromissoModel): string {
    if (c.dataInicio === c.dataFim) {
      return this.formatarDataBr(c.dataInicio);
    }
    return `${this.formatarDataBr(c.dataInicio)} – ${this.formatarDataBr(c.dataFim)}`;
  }

  // Diz se um compromisso dura mais de um dia (útil pra template)
  ehPeriodoMultiDia(c: CompromissoModel): boolean {
    return c.dataInicio !== c.dataFim;
  }

  // ─── Modal de detalhes ───────────────────────────────────────────────────

  abrirDetalhes(compromisso: CompromissoModel): void {
    this.selecionado = compromisso;
  }

  fecharDetalhes(): void {
    this.selecionado = null;
  }

  obterDiaSemanaDeData(dataIso: string): number {
    const data = new Date(dataIso + 'T00:00:00');
    return data.getDay();
  }
}