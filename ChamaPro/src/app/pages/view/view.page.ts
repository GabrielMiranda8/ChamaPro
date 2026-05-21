import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  mailOutline,
  calendarOutline,
  cardOutline,
  locationOutline,
  briefcaseOutline,
  arrowBackOutline,
  createOutline,
} from 'ionicons/icons';

export interface UserData {
  nome: string;
  email: string;
  dataNascimento: string;
  cpf: string;
  cep: string;
  isProfissional: boolean;
}

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonButton, IonIcon],
})
export class ViewPage implements OnInit {
  // TODO: substituir pelo retorno real do AuthService/UserService
  dados: UserData = {
    nome: '',
    email: '',
    dataNascimento: '',
    cpf: '',
    cep: '',
    isProfissional: false,
  };

  constructor() {
    addIcons({
      personOutline,
      mailOutline,
      calendarOutline,
      cardOutline,
      locationOutline,
      briefcaseOutline,
      arrowBackOutline,
      createOutline,
    });
  }

  ngOnInit(): void {
    this.carregarDados();
  }

  private carregarDados(): void {
    // TODO: this.dados = await this.userService.getPerfil();
    // Dados mockados para demonstração
    this.dados = {
      nome: 'João da Silva',
      email: 'joao@email.com',
      dataNascimento: '15/03/1995',
      cpf: '123.456.789-00',
      cep: '35920-000',
      isProfissional: false,
    };
  }
}