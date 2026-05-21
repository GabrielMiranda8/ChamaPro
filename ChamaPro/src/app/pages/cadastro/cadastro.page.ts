import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon,
  IonNote, IonToggle, IonSelect, IonSelectOption, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, eyeOutline, eyeOffOutline,
  personOutline, mailOutline, lockClosedOutline,
  calendarOutline, cardOutline, locationOutline,
  briefcaseOutline, personAddOutline,
} from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon,
    IonNote, IonToggle, IonSelect, IonSelectOption,
  ],
})
export class CadastroPage implements OnInit {

  // Lista de características carregada do service (usada no ion-select)
  todasCaracteristicas: CaracteristicaModel[] = [];

  // Controla visibilidade das senhas
  showSenha = signal(false);
  showConfirmarSenha = signal(false);

  // O formGroup casa 1-para-1 com os formControlName do HTML
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private caracteristicaService: CaracteristicaService,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    addIcons({
      arrowBackOutline, eyeOutline, eyeOffOutline,
      personOutline, mailOutline, lockClosedOutline,
      calendarOutline, cardOutline, locationOutline,
      briefcaseOutline, personAddOutline,
    });

    this.formGroup = this.formBuilder.group({
      nome:           ['', Validators.required],
      email:          ['', [Validators.required, Validators.email]],
      senha:          ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      dtNasc:         ['', Validators.required],
      cpf:            ['', [Validators.required, Validators.minLength(11)]],
      cep:            ['', Validators.required],
      caracteristicas: [[]],
      isProfissional: [false],
    });
  }

  ngOnInit() {
    // Carrega as características disponíveis para o ion-select
    this.todasCaracteristicas = this.caracteristicaService.listar();
  }

  toggleSenha()          { this.showSenha.update(v => !v); }
  toggleConfirmarSenha() { this.showConfirmarSenha.update(v => !v); }

  async salvar() {
    // Pega os valores do form
    const v = this.formGroup.value;

    // --- Validações manuais ---

    if (!v.nome?.trim()) {
      await this.exibirMensagem('Informe seu nome completo.'); return;
    }

    if (!v.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      await this.exibirMensagem('Informe um e-mail válido.'); return;
    }

    if (!v.senha || v.senha.length < 6) {
      await this.exibirMensagem('A senha deve ter no mínimo 6 caracteres.'); return;
    }

    if (v.senha !== v.confirmarSenha) {
      await this.exibirMensagem('As senhas não coincidem.'); return;
    }

    if (!v.dtNasc || v.dtNasc.length < 8) {
      await this.exibirMensagem('Informe a data de nascimento.'); return;
    }

    if (!v.cpf || v.cpf.replace(/\D/g, '').length < 11) {
      await this.exibirMensagem('Informe um CPF válido.'); return;
    }

    if (!v.cep || v.cep.replace(/\D/g, '').length < 8) {
      await this.exibirMensagem('Informe um CEP válido.'); return;
    }

    // --- Checa duplicatas ---

    const todos = this.usuarioService.listar();

    if (todos.some(u => u.email === v.email)) {
      await this.exibirMensagem("Este e-mail já está cadastrado."); return;
    }

    if (todos.some(u => u.cpf.replace(/[^0-9]/g, '') === v.cpf.replace(/[^0-9]/g, ''))) {
      await this.exibirMensagem("Este CPF já está cadastrado."); return;
    }

    // --- Monta e salva o usuário ---

    const usuario = new UsuarioModel();
    usuario.nome              = v.nome;
    usuario.email             = v.email;
    usuario.senha             = v.senha;
    usuario.cpf               = v.cpf;
    usuario.dtNasc            = v.dtNasc;
    usuario.endereco.cep      = v.cep;
    usuario.caracteristicas   = v.caracteristicas ?? [];
    usuario.tipo              = v.isProfissional ? 'PROFISSIONAL' : 'CLIENTE';

    this.usuarioService.salvar(usuario);
    await this.exibirMensagem('Conta criada com sucesso!');
    this.navController.navigateRoot('/login');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
    });
    toast.present();
  }
}