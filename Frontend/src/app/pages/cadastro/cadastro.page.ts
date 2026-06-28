import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonContent, IonLabel, IonInput, IonButton, IonIcon,
  IonToggle, IonSelect, IonSelectOption, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, eyeOutline, eyeOffOutline,
  calendarOutline, briefcaseOutline,
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
    IonContent, IonLabel, IonInput, IonButton, IonIcon,
    IonToggle, IonSelect, IonSelectOption,
  ],
})
export class CadastroPage implements OnInit {

  todasCaracteristicas: CaracteristicaModel[] = [];
  showSenha = signal(false);
  showConfirmarSenha = signal(false);
  formGroup: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private caracteristicaService: CaracteristicaService,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    addIcons({ arrowBackOutline, eyeOutline, eyeOffOutline, calendarOutline, briefcaseOutline });

    this.formGroup = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(3)]],
      confirmarSenha: ['', Validators.required],
      dtNasc: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.minLength(11)]],
      cep: ['', Validators.required],
      caracteristicas: [[]],
      isProfissional: [false],
    });
  }

  ngOnInit() {
    this.todasCaracteristicas = this.caracteristicaService.listar();
  }

  toggleSenha() { this.showSenha.update(v => !v); }
  toggleConfirmarSenha() { this.showConfirmarSenha.update(v => !v); }

  async salvar() {
    const v = this.formGroup.value;

    if (!v.nome?.trim()) {
      await this.exibirMensagem('Informe seu nome completo.'); return;
    }
    if (!v.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) {
      await this.exibirMensagem('Informe um e-mail válido.'); return;
    }
    if (!v.senha || v.senha.length < 3) {
      await this.exibirMensagem('A senha deve ter no mínimo 3 caracteres.'); return;
    }
    if (v.senha !== v.confirmarSenha) {
      await this.exibirMensagem('As senhas não coincidem.'); return;
    }
    if (!this.validarData(v.dtNasc)) {
      await this.exibirMensagem('Informe uma data válida (dd/mm/aaaa).'); return;
    }
    if (!v.cpf || v.cpf.replace(/\D/g, '').length < 11) {
      await this.exibirMensagem('Informe um CPF válido.'); return;
    }
    if (!v.cep || v.cep.replace(/\D/g, '').length < 8) {
      await this.exibirMensagem('Informe um CEP válido.'); return;
    }

  
    const partes = v.dtNasc.split('/');
    const dtNascDate = new Date(
      Number(partes[2]),  // ano
      Number(partes[1]) - 1,  // mês (0-indexed)
      Number(partes[0])   // dia
    );

    const usuario = new UsuarioModel();
    usuario.nome = v.nome;
    usuario.email = v.email;
    usuario.senha = v.senha;
    usuario.cpf = v.cpf;
    usuario.dtNasc = dtNascDate;
    usuario.endereco.cep = v.cep;
    usuario.caracteristicas = v.caracteristicas ?? [];
    usuario.tipo = v.isProfissional ? 'PROFISSIONAL' : 'CLIENTE';

    this.usuarioService.salvar(usuario).subscribe({
      next: async (usuarioSalvo) => {
        if (usuarioSalvo.tipo === 'PROFISSIONAL') {
          this.navController.navigateForward(`/add-servico/${usuarioSalvo.id}`);
          return;
        }
        await this.exibirMensagem('Conta criada com sucesso!');
        this.navController.navigateRoot('/login');
      },
      error: (err) => {
        console.log('Erro ao salvar:', err);
        this.exibirMensagem('Erro ao criar conta. Verifique os dados.');
      }
    });
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  mascaraData(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    this.formGroup.patchValue({ dtNasc: valor }, { emitEvent: false });
  }

  mascaraCpf(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1-$2');
    this.formGroup.patchValue({ cpf: valor }, { emitEvent: false });
  }

  mascaraCep(event: any) {
    let valor = event.target.value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    this.formGroup.patchValue({ cep: valor }, { emitEvent: false });
  }

  validarData(data: string): boolean {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(data)) return false;
    const [dia, mes, ano] = data.split('/').map(Number);
    if (mes < 1 || mes > 12) return false;
    const dataObj = new Date(ano, mes - 1, dia);
    if (dataObj.getFullYear() !== ano || dataObj.getMonth() !== mes - 1 || dataObj.getDate() !== dia) return false;
    return dataObj <= new Date();
  }
}
