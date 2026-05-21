import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonNote, IonToggle, IonSelect, IonSelectOption, ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline, eyeOutline, eyeOffOutline, personOutline, mailOutline, lockClosedOutline, calendarOutline, cardOutline, locationOutline, briefcaseOutline, personAddOutline } from 'ionicons/icons';
import { ActivatedRoute } from '@angular/router';
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
  imports: [CommonModule, FormsModule, RouterModule, IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonNote, IonToggle, IonSelect, IonSelectOption, ReactiveFormsModule],
})
export class CadastroPage {
  todasCaracteristicas: CaracteristicaModel[] = [];
  usuario: UsuarioModel;
  isProfissional = false;
  confirmarSenha = "";
  formGroup: FormGroup;

  // UI state
  submitted = false;
  errors: Record<string, string> = {};

  // Password visibility (using signals)
  showSenha = signal(false);
  showConfirmarSenha = signal(false);

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private toastController: ToastController, private navController: NavController, private usuarioService: UsuarioService, private caracteristicaService: CaracteristicaService) {
    addIcons({ arrowBackOutline, personOutline, mailOutline, lockClosedOutline, calendarOutline, cardOutline, locationOutline, briefcaseOutline, personAddOutline, eyeOutline, eyeOffOutline });

    this.usuario = new UsuarioModel();

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      cpf: ['', Validators.compose([Validators.required, Validators.minLength(11)])],
      dtNasc: ['', Validators.compose([Validators.required])],
      tipo: ['', Validators.compose([Validators.required])],
      cep: ['', Validators.compose([Validators.required])],
      caracteristicas: [[]],
    });
  }

  ngOnInit() {
    this.todasCaracteristicas = this.caracteristicaService.listar();
    let id = this.activatedRoute.snapshot.params['id'];
    if (!isNaN(id)) {
      this.usuario = this.usuarioService.buscarPorId(id);
    }
    this.formGroup.get('nome')?.setValue(this.usuario.nome);
    this.formGroup.get('email')?.setValue(this.usuario.email);
    this.formGroup.get('senha')?.setValue(this.usuario.senha);
    this.formGroup.get('cpf')?.setValue(this.usuario.cpf);
    this.formGroup.get('dtNasc')?.setValue(this.usuario.dtNasc);
    this.formGroup.get('cep')?.setValue(this.usuario.endereco.cep);
  }


  toggleSenha(): void {
    this.showSenha.update((v) => !v);
  }

  toggleConfirmarSenha(): void {
    this.showConfirmarSenha.update((v) => !v);
  }

  salvar() {

    this.usuario.nome = this.formGroup.value.nome;
    this.usuario.email = this.formGroup.value.email;
    this.usuario.senha = this.formGroup.value.senha;
    this.usuario.cpf = this.formGroup.value.cpf;
    this.usuario.dtNasc = this.formGroup.value.dtNasc;
    this.usuario.endereco.cep = this.formGroup.value.cep;
    this.usuario.caracteristicas = this.formGroup.value.caracteristicas ?? [];
    if (this.isProfissional)
      this.usuario.tipo = "PROFISSIONAL";
    else
      this.usuario.tipo = "CLIENTE";

    console.log(this.usuario);
    this.usuarioService.salvar(this.usuario);
    this.exibirMensagem("Usuário cadastrado com sucesso");
    this.navController.navigateBack('/login');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 1500
    });
    toast.present()
  }

  private validate(): boolean {
    this.errors = {};

    if (!this.usuario.nome.trim()) {
      this.errors['nome'] = 'Nome é obrigatório.';
    }

    if (!this.usuario.email.trim()) {
      this.errors['email'] = 'E-mail é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.usuario.email)) {
      this.errors['email'] = 'E-mail inválido.';
    }

    if (!this.usuario.senha) {
      this.errors['senha'] = 'Senha é obrigatória.';
    } else if (this.usuario.senha.length < 6) {
      this.errors['senha'] = 'Senha deve ter no mínimo 6 caracteres.';
    }

    if (!this.confirmarSenha) {
      this.errors['confirmarSenha'] = 'Confirmação de senha é obrigatória.';
    } else if (this.confirmarSenha !== this.usuario.senha) {
      this.errors['confirmarSenha'] = 'As senhas não coincidem.';
    }

    if (!this.usuario.dtNasc) {
      this.errors['dataNascimento'] = 'Data obrigatória.';
    } else if (this.usuario.dtNasc.length < 10) {
      this.errors['dataNascimento'] = 'Data inválida.';
    }

    if (!this.usuario.cpf) {
      this.errors['cpf'] = 'CPF é obrigatório.';
    } else if (this.usuario.cpf.length < 14) {
      this.errors['cpf'] = 'CPF inválido.';
    }

    if (!this.usuario.endereco.cep) {
      this.errors['cep'] = 'CEP é obrigatório.';
    } else if (this.usuario.endereco.cep.length < 9) {
      this.errors['cep'] = 'CEP inválido.';
    }

    return Object.keys(this.errors).length === 0;
  }

  // Mascara ta dando errado

  /*onDataInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    this.usuario.dtNasc = value;
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

    this.usuario.cpf = value;
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length > 5) {
      value = `${value.slice(0, 5)}-${value.slice(5)}`;
    }

    this.usuario.endereco.cep = value;
  }
    */
  // ── Validation ───────────────────────────────────────────────────────────


}