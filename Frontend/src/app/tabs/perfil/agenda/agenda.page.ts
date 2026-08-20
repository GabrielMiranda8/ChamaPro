import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonIcon, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, timeOutline, personOutline, calendarClearOutline } from 'ionicons/icons';

import { CompromissoService } from 'src/app/services/compromisso.service';
import { TokenService } from 'src/app/services/token.service';
import { CompromissoModel } from 'src/app/model/compromisso.model';

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

  private readonly diasSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  constructor(
    private compromissoService: CompromissoService,
    private tokenService: TokenService,
  ) {
    addIcons({ arrowBackOutline, timeOutline, personOutline, calendarClearOutline });
  }

  ngOnInit(): void {
    this.carregarAgenda();
  }

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

  obterDiaSemana(dataTexto: string): string {
    const data = new Date(dataTexto + 'T00:00:00');
    return this.diasSemana[data.getDay()];
  }
}