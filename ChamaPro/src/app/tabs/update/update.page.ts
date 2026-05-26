import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonLabel, IonInput,
  IonButton, IonIcon, IonToggle,
  ToastController,
} from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../model/usuario.model';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    IonContent, IonLabel, IonInput,
    IonButton, IonIcon, IonToggle,
  ],
})
export class UpdatePage implements OnInit {

  private usuarioLogado!: UsuarioModel;

  novaSenha = '';
  confirmarNovaSenha = '';
  cep = '';
  isProfissional = false;

  submitted = false;
  errors: Record<string, string> = {};

  showSenha = signal(false);
  showConfirmarNovaSenha = signal(false);

  constructor(
    private usuarioService: UsuarioService,
    private navController: NavController,
    private toastController: ToastController,
  ) {
    addIcons({ arrowBackOutline, eyeOutline, eyeOffOutline });
  }

  ngOnInit(): void {
    const logado = this.usuarioService.getLogin();
    if (!logado) {
      this.navController.navigateRoot('/login');
      return;
    }
    this.usuarioLogado = logado;
    // Pré-preenche com dados atuais do usuário
    this.cep = logado.endereco?.cep ?? '';
    this.isProfissional = logado.tipo === 'profissional';
  }

  toggleSenha(): void { this.showSenha.update((v) => !v); }
  toggleConfirmarNovaSenha(): void { this.showConfirmarNovaSenha.update((v) => !v); }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);
    if (value.length > 5) value = `${value.slice(0, 5)}-${value.slice(5)}`;
    this.cep = value;
  }

  private validate(): boolean {
    this.errors = {};

    // Senha só é obrigatória se o usuário começou a preencher
    if (this.novaSenha || this.confirmarNovaSenha) {
      if (this.novaSenha.length < 6)
        this.errors['novaSenha'] = 'Senha deve ter no mínimo 6 caracteres.';
      if (this.confirmarNovaSenha !== this.novaSenha)
        this.errors['confirmarNovaSenha'] = 'As senhas não coincidem.';
    }

    if (!this.cep)
      this.errors['cep'] = 'CEP é obrigatório.';
    else if (this.cep.replace(/\D/g, '').length < 8)
      this.errors['cep'] = 'CEP inválido.';

    return Object.keys(this.errors).length === 0;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    if (!this.validate()) return;

    const alteracoes: Partial<UsuarioModel> = {
      tipo: this.isProfissional ? 'profissional' : 'cliente',
      endereco: { ...this.usuarioLogado.endereco, cep: this.cep },
    };

    // Só troca a senha se o usuário preencheu os campos
    if (this.novaSenha) alteracoes.senha = this.novaSenha;

    const resultado = this.usuarioService.atualizarLogado(alteracoes);

    if (!resultado) {
      const toast = await this.toastController.create({
        message: 'Sessão expirada. Faça login novamente.',
        duration: 2500, color: 'danger', position: 'bottom',
      });
      await toast.present();
      this.navController.navigateRoot('/login');
      return;
    }

    const toast = await this.toastController.create({
      message: 'Dados atualizados com sucesso!',
      duration: 2000, color: 'success', position: 'bottom',
    });
    await toast.present();
    this.navController.navigateBack('/menu');
  }
}