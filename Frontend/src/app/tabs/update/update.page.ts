import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  eyeOutline,
  eyeOffOutline,
  createOutline,
  personOutline,
} from 'ionicons/icons';

import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../model/usuario.model';
import { TokenModel } from 'src/app/model/token.model';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonToggle,
  ],
})
export class UpdatePage implements OnInit {
  private usuarioLogado!: UsuarioModel;
  token!: TokenModel;

  novaSenha = '';
  confirmarNovaSenha = '';
  cep = '';
  cepOriginal = '';
  isProfissional = false;

  submitted = false;
  errors: Record<string, string> = {};

  showSenha = signal(false);
  showConfirmarNovaSenha = signal(false);

  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController,
    private toastController: ToastController,
    private tokenService: TokenService
  ) {
    addIcons({
      arrowBackOutline,
      createOutline,
      eyeOutline,
      eyeOffOutline,
      personOutline,
    });
  }

  ngOnInit(): void {
    this.token = this.tokenService.extrair();

    if (!this.token?.id) {
      this.navController.navigateRoot('/login');
      return;
    }

    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.usuarioLogado = usuario;
        this.cep = usuario.endereco?.cep ?? '';
        this.cepOriginal = this.cep;
        this.isProfissional = usuario.tipo === 'PROFISSIONAL';
      },
      error: async (err) => {
        console.log('Erro ao carregar usuário:', err);
        await this.mostrarToast('Erro ao carregar seus dados.', 'danger');
        this.navController.navigateRoot('/login');
      },
    });
  }

  toggleSenha(): void {
    this.showSenha.update((v) => !v);
  }

  toggleConfirmarNovaSenha(): void {
    this.showConfirmarNovaSenha.update((v) => !v);
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    this.cep = value;
  }

  private validate(): boolean {
    this.errors = {};

    if (this.novaSenha || this.confirmarNovaSenha) {
      if (this.novaSenha.length < 3) {
        this.errors['novaSenha'] = 'Senha deve ter no mínimo 3 caracteres.';
      }

      if (this.confirmarNovaSenha !== this.novaSenha) {
        this.errors['confirmarNovaSenha'] = 'As senhas não coincidem.';
      }
    }

    if (!this.cep) {
      this.errors['cep'] = 'CEP é obrigatório.';
    } else if (this.cep.replace(/\D/g, '').length !== 8) {
      this.errors['cep'] = 'CEP inválido.';
    }

    return Object.keys(this.errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (!this.validate()) return;

    if (!this.token?.id) {
      await this.mostrarToast('Sessão expirada. Faça login novamente.', 'danger');
      this.navController.navigateRoot('/login');
      return;
    }

    if (!this.usuarioLogado) {
      await this.mostrarToast('Dados do usuário ainda não carregados. Tente novamente.', 'danger');
      return;
    }

    const senhaFoiAlterada = !!this.novaSenha;
    const cepFoiAlterado = this.cep !== this.cepOriginal;

    if (!senhaFoiAlterada && !cepFoiAlterado) {
      await this.mostrarToast('Nenhuma alteração foi feita.', 'warning');
      return;
    }

    try {
      if (senhaFoiAlterada) {
        await this.usuarioService.alterarSenha(this.token.id, this.novaSenha).toPromise();
      }

      if (cepFoiAlterado) {
        await this.usuarioService.alterarCep(this.token.id, this.cep).toPromise();
        this.cepOriginal = this.cep;
      }

      this.novaSenha = '';
      this.confirmarNovaSenha = '';

      await this.mostrarToast('Dados atualizados com sucesso!', 'success');
      this.navController.navigateBack('/tabs/perfil');
    } catch (err: any) {
      console.log('Erro ao atualizar:', err);
      console.log('Erros de validação:', err?.error?.errors);
      await this.mostrarToast('Erro ao atualizar dados. Verifique os campos.', 'danger');
    }
  }

  private async mostrarToast(message: string, color: 'success' | 'danger' | 'warning'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
    });

    await toast.present();
  }
}