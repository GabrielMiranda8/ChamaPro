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
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EnderecoService } from 'src/app/services/endereco.service';

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
    private enderecoService: EnderecoService,
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
      rua: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      referencia: [''],
      caracteristicas: [[]],
      caracteristicasLida: [[]],
      isProfissional: [false],
    });
  }

  ngOnInit() {
    this.caracteristicaService.listar().subscribe({
      next: (caracs) => {
        this.todasCaracteristicas = caracs;
      },
      error: (err) => {
        console.log("Erro ao listar caracteristicas: ", err)
        this.exibirMensagem("Erro ao listar caracteristicas");
      }
    });
  }

  toggleSenha() { this.showSenha.update(v => !v); }
  toggleConfirmarSenha() { this.showConfirmarSenha.update(v => !v); }

  // Cadastro
  // Validação manual (alem dos Validators do FormGroup) porque campos como
  // data, CPF e CEP tem mascara propria e precisam de checagem específicae

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

    // O input usa máscara dd/mm/aaaa mas o backend espera Date
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
    usuario.endereco.rua = v.rua;
    usuario.endereco.bairro = v.bairro;
    usuario.endereco.cidade = v.cidade;
    usuario.endereco.numero = Number(v.numero);
    usuario.endereco.complemento = v.complemento;
    usuario.endereco.referencia = v.referencia;
    usuario.tipo = v.isProfissional ? 'PROFISSIONAL' : 'CLIENTE';
    // As características não vão dentro do usuário: cada uma vira um
    // registro próprio (CaracteristicaUsuario) salvo depois, em salvarCaracteristicas().

    this.usuarioService.salvar(usuario).subscribe({
      next: async (usuarioSalvo) => {
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
  // Junta as duas listas do formulário (o que o usuário "tem" e o que o
  // profissional "sabe lidar") num único registro por característica, já
  // que tem/lida moram na mesma linha de CaracteristicaUsuario. Se a mesma
  // característica aparecer nas duas listas, os dois campos ficam true.
  private async salvarCaracteristicas(idUsuario: string, v: any): Promise<void> {
    let tenho: CaracteristicaModel[] = v.caracteristicas;
    if (!tenho) {
      tenho = [];
    }

    let seiLidar: CaracteristicaModel[] = v.caracteristicasLida;
    if (!seiLidar) {
      seiLidar = [];
    }

    // Lista simples: cada posição guarda o id de uma característica e se
    // o usuário "tem" e/ou "sabe lidar" com ela.
    const lista: { idCaracteristica: string; tem: boolean; lida: boolean }[] = [];

    // Primeiro, adiciona todas as características que o usuário marcou
    // como "tenho" (todas entram com lida = false por enquanto).
    for (const caracteristica of tenho) {
      lista.push({ idCaracteristica: caracteristica.id, tem: true, lida: false });
    }

    // Agora percorre a lista de "sei lidar". Se a característica já
    // estiver na lista (porque também apareceu em "tenho"), só liga o
    // campo lida nela. Se ainda não estiver, adiciona uma entrada nova.
    for (const caracteristica of seiLidar) {
      let jaEstaNaLista = false;

      for (const item of lista) {
        if (item.idCaracteristica === caracteristica.id) {
          item.lida = true;
          jaEstaNaLista = true;
          break;
        }
      }

      if (!jaEstaNaLista) {
        lista.push({ idCaracteristica: caracteristica.id, tem: false, lida: true });
      }
    }

    if (lista.length === 0) {
      return;
    }

    // Monta uma chamada HTTP pra cada característica da lista (ainda sem
    // disparar nenhuma — só cria os "pedidos", o forkJoin lá embaixo que
    // dispara todos juntos).
    const chamadas: Observable<CaracteristicaUsuarioModel>[] = [];
    for (const item of lista) {
      const cu = new CaracteristicaUsuarioModel();
      cu.idUsuario = idUsuario;
      cu.idCaracteristica = item.idCaracteristica;
      cu.tem = item.tem;
      cu.lida = item.lida;
      chamadas.push(this.caracteristicaUsuarioService.salvar(cu));
    }

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

    const cepLimpo = valor.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      this.buscarEnderecoPorCep(cepLimpo);
    }
  }

  private buscarEnderecoPorCep(cep: string): void {
    this.enderecoService.buscarPorCep(cep).subscribe({
      next: (dados) => {
        if (dados.erro) {
          this.exibirMensagem('CEP não encontrado.');
          return;
        }

        this.formGroup.patchValue({
          rua: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
        });
      },
      error: (err) => {
        console.log('Erro ao buscar CEP: ', err);
        this.exibirMensagem('Não foi possível buscar o CEP. Preencha manualmente.');
      }
    });
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
