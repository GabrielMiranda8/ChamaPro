import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, mailOutline, calendarOutline, cardOutline, locationOutline,
  briefcaseOutline, arrowBackOutline, createOutline, readerOutline,
  notificationsOutline, shieldOutline, settingsOutline, chevronForwardOutline,
  logOutOutline, star, accessibilityOutline,
} from 'ionicons/icons';

import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { TokenModel } from 'src/app/model/token.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonButton, IonIcon],
})
export class PerfilPage implements OnInit {
  dados: UsuarioModel = new UsuarioModel();
  token!: TokenModel;

  constructor(
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private alertController: AlertController,
    private tokenService: TokenService,
  ) {
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
      accessibilityOutline,
    });
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
      },
      error: (err) => {
        console.log('Erro ao carregar dados de usuário:', err);
      },
    });
  }

  obterIniciais(nome: string): string {
    if (!nome) return '?';
    return nome
      .trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((x) => x[0])
      .join('')
      .toUpperCase();
  }

  // ─── Ações da conta ─────────────────────────────────────────────────────────

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

            this.usuarioService.excluir(logado.id).subscribe({
              next: () => {
                this.usuarioService.logout(); // limpa o token, já que a conta não existe mais
                this.navController.navigateRoot('/login');
              },
              error: (err) => {
                console.log('Erro ao excluir conta:', err);
                this.exibirMensagem('Não foi possível excluir sua conta. Tente novamente.');
              },
            });
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

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  // ─── Atalhos ainda não implementados ────────────────────────────────────────

  editarPerfil(): void {
    console.log('Editar Perfil');
  }

  historicoPedidos(): void {
    console.log('Histórico');
  }

  gerenciarAgenda(): void {
    console.log('Agenda');
  }

  abrirNotificacoes(): void {
    console.log('Notificações');
  }

  abrirSeguranca(): void {
    console.log('Segurança');
  }

  abrirConfiguracoes(): void {
    console.log('Configurações');
  }
}
