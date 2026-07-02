import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, mailOutline, calendarOutline, cardOutline, locationOutline, briefcaseOutline, arrowBackOutline, createOutline, chevronForwardOutline, readerOutline, notificationsOutline, shieldOutline, settingsOutline, logOutOutline, star, } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { AlertController, ToastController, NavController } from '@ionic/angular';
import { TokenModel } from 'src/app/model/token.model';
import { TokenService } from 'src/app/services/token.service';

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
  token!: TokenModel;

  constructor(private usuarioService: UsuarioService, private toastController: ToastController, private navController: NavController, private alertController: AlertController, private tokenService: TokenService) {
    addIcons({
      personOutline,
      mailOutline,
      calendarOutline,
      cardOutline,
      locationOutline,
      briefcaseOutline,
      arrowBackOutline,
      createOutline,
      chevronForwardOutline,
      readerOutline,
      notificationsOutline,
      shieldOutline,
      settingsOutline,
      logOutOutline,
      star,
    });
    this.dados = new UsuarioModel();
  }

  obterIniciais(nome: string): string {
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase();
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
      }
    })
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
            const logado = this.dados;
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
            this.usuarioService.logout();
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