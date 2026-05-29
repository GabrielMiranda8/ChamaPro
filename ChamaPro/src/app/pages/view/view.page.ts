import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
    IonContent,
  IonButton,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonLabel,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  locationOutline,
  star,
  chevronForwardOutline,
  readerOutline,
  calendarOutline,
  notificationsOutline,
  shieldOutline,
  settingsOutline,
  logOutOutline,
  homeOutline,
  searchOutline,
  clipboardOutline,
  
} from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/model/usuario.model';

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
  imports: [CommonModule, RouterModule, IonContent, IonButton, IonIcon, IonTabBar, IonTabButton, IonLabel,],
})
export class ViewPage implements OnInit {
  // TODO: substituir pelo retorno real do AuthService/UserService
  dados: UsuarioModel;

  constructor(private usuarioService: UsuarioService) {
    addIcons({
      personOutline,
      locationOutline,
      star,
      chevronForwardOutline,
      readerOutline,
      calendarOutline,
      notificationsOutline,
      shieldOutline,
      settingsOutline,
      logOutOutline,
      homeOutline,
      searchOutline,
      clipboardOutline,
    });
    this.dados = new UsuarioModel();
  }

  ngOnInit(): void {
    this.dados = this.usuarioService.getLogin();
  }

  editarPerfil() {
    console.log('Editar Perfil');
  }

  historicoPedidos() {
    console.log('Histórico');
  }

  gerenciarAgenda() {
    console.log('Agenda');
  }

  abrirNotificacoes() {
    console.log('Notificações');
  }

  abrirSeguranca() {
    console.log('Segurança');
  }

  abrirConfiguracoes() {
    console.log('Configurações');
  }

  sair() {
    console.log('Logout');
  }

}