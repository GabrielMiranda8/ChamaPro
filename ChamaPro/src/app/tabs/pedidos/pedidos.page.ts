import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonContent,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  timeOutline,
  checkmarkCircleOutline,
  constructOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.page.html',
  styleUrls: ['./pedidos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon
  ]
})
export class PedidosPage {

  pedidos = [
    {
      servico: 'Reparo elétrico',
      profissional: 'Ana Silva',
      valor: 160,
      data: 'Hoje, 14:00',
      status: 'andamento'
    },
    {
      servico: 'Manutenção do Sistema',
      profissional: 'Carlos Santos',
      valor: 140,
      data: 'Amanhã, 09:00',
      status: 'agendado'
    },
    {
      servico: 'Reparar Cerca Elétrica',
      profissional: 'Maria Oliveira',
      valor: 480,
      data: '22 Fev, 10:00',
      status: 'concluido'
    },
    {
      servico: 'Colocar Painel',
      profissional: 'Pedro Lima',
      valor: 2000,
      data: '18 Fev, 15:00',
      status: 'concluido'
    }
  ];

  constructor() {
    addIcons({
      'time-outline': timeOutline,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'construct-outline': constructOutline
    });
  }

}
