import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlertController, NavController, ToastController } from '@ionic/angular';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, trashOutline, logOutOutline, chevronForwardOutline,
} from 'ionicons/icons';

import { UsuarioService } from 'src/app/services/usuario.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonContent, IonIcon, IonButton],
})
export class ConfiguracoesPage {

  constructor(
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private navController: NavController,
    private alertController: AlertController,
    private tokenService: TokenService,
  ) {
    addIcons({
      arrowBackOutline,
      trashOutline,
      logOutOutline,
      chevronForwardOutline,
    });
  }

  // ─── Ações da conta ─────────────────────────────────────────────────────────

  async confirmarDelete(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Deletar Conta',
      message: 'Esta ação é irreversível. Todos os seus dados serão apagados permanentemente.',
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
    const token = this.tokenService.extrair();

    this.usuarioService.excluir(token.id).subscribe({
      next: () => {
        this.usuarioService.logout();
        this.navController.navigateRoot('/login');
      },
      error: (err) => {
        console.log('Erro ao excluir conta:', err);
        this.exibirMensagem('Não foi possível excluir sua conta. Tente novamente.');
      },
    });
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

  async exibirMensagem(texto: string): Promise<void> {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
