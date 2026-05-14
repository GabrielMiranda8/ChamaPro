import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonNote, IonToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonIcon,
    IonNote,
    IonToggle,
  ],
})
export class CadastroPage {
  // Form fields
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  dataNascimento = '';
  cpf = '';
  cep = '';
  isProfissional = false;

  // UI state
  submitted = false;
  errors: Record<string, string> = {};

  // Password visibility (using signals)
  showSenha = signal(false);
  showConfirmarSenha = signal(false);

  constructor() {
    addIcons({ arrowBackOutline, eyeOutline, eyeOffOutline });
  }

  toggleSenha(): void {
    this.showSenha.update((v) => !v);
  }

  toggleConfirmarSenha(): void {
    this.showConfirmarSenha.update((v) => !v);
  }

  // ── Masks ────────────────────────────────────────────────────────────────

  onDataInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    this.dataNascimento = value;
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 11);

    if (value.length > 9) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
      value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
      value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }

    this.cpf = value;
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    this.cep = value;
  }

  // ── Validation ───────────────────────────────────────────────────────────

  private validate(): boolean {
    this.errors = {};

    if (!this.nome.trim()) {
      this.errors['nome'] = 'Nome é obrigatório.';
    }

    if (!this.email.trim()) {
      this.errors['email'] = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors['email'] = 'E-mail inválido.';
    }

    if (!this.senha) {
      this.errors['senha'] = 'Senha é obrigatória.';
    } else if (this.senha.length < 6) {
      this.errors['senha'] = 'Senha deve ter no mínimo 6 caracteres.';
    }

    if (!this.confirmarSenha) {
      this.errors['confirmarSenha'] = 'Confirmação de senha é obrigatória.';
    } else if (this.confirmarSenha !== this.senha) {
      this.errors['confirmarSenha'] = 'As senhas não coincidem.';
    }

    if (!this.dataNascimento) {
      this.errors['dataNascimento'] = 'Data obrigatória.';
    } else if (this.dataNascimento.length < 10) {
      this.errors['dataNascimento'] = 'Data inválida.';
    }

    if (!this.cpf) {
      this.errors['cpf'] = 'CPF é obrigatório.';
    } else if (this.cpf.length < 14) {
      this.errors['cpf'] = 'CPF inválido.';
    }

    if (!this.cep) {
      this.errors['cep'] = 'CEP é obrigatório.';
    } else if (this.cep.length < 9) {
      this.errors['cep'] = 'CEP inválido.';
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    this.submitted = true;

    if (!this.validate()) {
      return;
    }

    const payload = {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      dataNascimento: this.dataNascimento,
      cpf: this.cpf,
      cep: this.cep,
      isProfissional: this.isProfissional,
    };

    console.log('Cadastro payload:', payload);
    // TODO: call your AuthService.register(payload) here
  }
}