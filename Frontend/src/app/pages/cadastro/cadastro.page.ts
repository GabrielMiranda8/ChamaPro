import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
  IonContent, IonLabel, IonInput, IonButton, IonIcon,
  IonToggle, IonSelect, IonSelectOption, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, eyeOutline, eyeOffOutline,
  calendarOutline, briefcaseOutline,
} from 'ionicons/icons';

import { UsuarioService } from 'src/app/services/usuario.service';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaUsuarioService } from 'src/app/services/caracteristica-usuario.service';
import { CaracteristicaUsuarioModel } from 'src/app/model/caracteristica-usuario.model';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
    private caracteristicaUsuarioService: CaracteristicaUsuarioService,
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
      caracteristicas: [[]],       // características que o usuário tem
      caracteristicasLida: [[]],   // características que o profissional sabe atender
      isProfissional: [false],
    });
  }

  ngOnInit() {
    this.caracteristicaService.listar().subscribe({
      next:(caracs) =>{
        this.todasCaracteristicas = caracs;
      },
      error: (err) =>{
        console.log("Erro ao listar caracteristicas: ", err)
        this.exibirMensagem("Erro ao listar caracteristicas");
      }
    });
  }

  toggleSenha() { this.showSenha.update(v => !v); }
  toggleConfirmarSenha() { this.showConfirmarSenha.update(v => !v); }

  // ─── Cadastro ───────────────────────────────────────────────────────────────
  // Validação manual (além dos Validators do FormGroup) porque campos como
  // data, CPF e CEP têm máscara própria e precisam de checagem específica.

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

    // O input usa máscara dd/mm/aaaa, mas o backend espera um Date real.
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
    usuario.tipo = v.isProfissional ? 'PROFISSIONAL' : 'CLIENTE';
    // As características não vão dentro do usuário: cada uma vira um
    // registro próprio (CaracteristicaUsuario) salvo depois, em salvarCaracteristicas().

    this.usuarioService.salvar(usuario).subscribe({
      next: async (usuarioSalvo) => {
        // Se marcou "sou profissional", faz uma segunda chamada para ativar
        // o perfil profissional e leva direto para cadastrar os serviços.
        if (v.isProfissional) {
          this.usuarioService.criarProfissional(usuarioSalvo.id).subscribe({
            next: async () => {
              await this.salvarCaracteristicas(usuarioSalvo.id, v);
              this.navController.navigateForward(`/add-servico/${usuarioSalvo.id}`);
            },
            error: async () => {
              await this.exibirMensagem('Conta criada, porém não foi possível ativar perfil profissional.');
              await this.salvarCaracteristicas(usuarioSalvo.id, v);
              this.navController.navigateForward(`/add-servico/${usuarioSalvo.id}`);
            }
          });
          return;
        }

        await this.salvarCaracteristicas(usuarioSalvo.id, v);
        await this.exibirMensagem('Conta criada com sucesso!');
        this.navController.navigateRoot('/login');
      },
      error: (err) => {
        console.log('Erro ao salvar:', err);
        this.exibirMensagem('Erro ao criar conta. Verifique os dados.');
      }
    });
  }

  // Junta as duas listas do formulário (o que o usuário "tem" e o que o
  // profissional "sabe lidar") num único registro por característica, já
  // que tem/lida moram na mesma linha de CaracteristicaUsuario. Se a mesma
  // característica aparecer nas duas listas, os dois campos ficam true.
  private async salvarCaracteristicas(idUsuario: string, v: any): Promise<void> {
    const tenho: CaracteristicaModel[] = v.caracteristicas ?? [];
    const seiLidar: CaracteristicaModel[] = v.caracteristicasLida ?? [];

    const porId = new Map<string, { nome: string; tem: boolean; lida: boolean }>();
    for (const c of tenho) {
      porId.set(c.id, { nome: c.nome, tem: true, lida: false });
    }
    for (const c of seiLidar) {
      const atual = porId.get(c.id) ?? { nome: c.nome, tem: false, lida: false };
      atual.lida = true;
      porId.set(c.id, atual);
    }

    if (porId.size === 0) return;

    const chamadas = Array.from(porId.entries()).map(([idCaracteristica, dados]) => {
      const cu = new CaracteristicaUsuarioModel();
      cu.idUsuario = idUsuario;
      cu.idCaracteristica = idCaracteristica;
      cu.tem = dados.tem;
      cu.lida = dados.lida;
      return this.caracteristicaUsuarioService.salvar(cu);
    });

    await new Promise<void>((resolve) => {
      forkJoin(chamadas).pipe(
        catchError(() => of(null)), // não trava o cadastro se uma característica falhar
      ).subscribe(() => resolve());
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

  // ─── Máscaras de input ──────────────────────────────────────────────────────
  // Cada uma remove tudo que não é dígito e reinsere os separadores enquanto
  // o usuário digita (dd/mm/aaaa, xxx.xxx.xxx-xx, xxxxx-xxx).

  mascaraData(event: Event) {
    let valor = (event.target as HTMLInputElement).value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    this.formGroup.patchValue({ dtNasc: valor }, { emitEvent: false });
  }

  mascaraCpf(event: Event) {
    let valor = (event.target as HTMLInputElement).value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    valor = valor.replace(/\.(\d{3})(\d)/, '.$1-$2');
    this.formGroup.patchValue({ cpf: valor }, { emitEvent: false });
  }

  mascaraCep(event: Event) {
    let valor = (event.target as HTMLInputElement).value;
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/^(\d{5})(\d)/, '$1-$2');
    this.formGroup.patchValue({ cep: valor }, { emitEvent: false });
  }

  // Confere se a data digitada é válida (ex: rejeita 31/02/2024) e não está no futuro.
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
