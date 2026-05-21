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
  imports: [CommonModule, RouterModule, IonContent, IonButton, IonIcon],
})
export class ViewPage implements OnInit {
  // TODO: substituir pelo retorno real do AuthService/UserService
  dados: UsuarioModel;

  constructor(private usuarioService: UsuarioService) {
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
    this.dados = new UsuarioModel();
  }

  ngOnInit(): void {
    this.dados = this.usuarioService.getLogin();
  }

}