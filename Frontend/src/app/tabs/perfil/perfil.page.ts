import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonButton, IonIcon, NavController, } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, calendarOutline, cardOutline, locationOutline, briefcaseOutline, arrowBackOutline, createOutline, } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { AlertController, ToastController } from '@ionic/angular';

export interface UserData {
  nome: string;
  email: string;
  dataNascimento: string;
  cpf: string;
  cep: string;
  isProfissional: boolean;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonButton, IonIcon],
})
export class PerfilPage implements OnInit {
  // TODO: substituir pelo retorno real do AuthService/UserService
  dados: UsuarioModel;

  constructor(private usuarioService: UsuarioService, private toastController: ToastController, private navController: NavController, private alertController: AlertController) {
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
  async confirmarDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: ' Deletar Conta',
      message: 'Esta ação é irrevrersível. Todos os seus dados serão apagados permanentemente.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sim, deletar',
          role: 'destructive',
          cssClass: 'alert-btn-danger',
          handler: () => this.deletarConta(),
        },
      ],
    });
    await alert.present();
  }

  async deletarConta(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Excluir',
      message: 'Deseja excluir sua conta? Essa ação é permanente',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Excluir',
          handler: () => {
            const logado = this.usuarioService.getLogin();
            if (!logado) return;
            this.usuarioService.excluir(logado.id);
            this.navController.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
  }

  async sair(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sair',
      message: 'Deseja sair da sua conta?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sair',
          handler: () => {
            this.usuarioService.excluirLogin();
            this.navController.navigateRoot('/login');
          },
        },
      ],
    });
    await alert.present();
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

}