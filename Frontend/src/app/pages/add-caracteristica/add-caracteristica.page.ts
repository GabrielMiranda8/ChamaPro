import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, ToastController } from '@ionic/angular';
import { IonContent, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  accessibilityOutline, chevronBackOutline, personOutline, eyeOutline,
} from 'ionicons/icons';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';
import { CaracteristicaUsuarioModel } from 'src/app/model/caracteristica-usuario.model';
import { CaracteristicaUsuarioService } from 'src/app/services/caracteristica-usuario.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-caracteristica',
  templateUrl: './add-caracteristica.page.html',
  styleUrls: ['./add-caracteristica.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, IonSpinner],
})
export class AddCaracteristicaPage implements OnInit {

  usuarioId!: string;
  isProfissional = false;

  todasCaracteristicas: CaracteristicaModel[] = [];

  // Uma linha de CaracteristicaUsuario por característica que o usuário já
  // tem algum vínculo (tem e/ou lida marcados). Guardado num Map pra achar
  // rápido o vínculo (e o id dele, necessário pra excluir/atualizar) a
  // partir do id da característica.
  minhasCaracteristicas = new Map<string, CaracteristicaUsuarioModel>();

  carregando = true;
  // Trava por característica, pra não deixar clicar de novo enquanto a
  // chamada anterior daquele chip ainda não voltou.
  processando: Record<string, boolean> = {};

  constructor(
    private caracteristicaService: CaracteristicaService,
    private caracteristicaUsuarioService: CaracteristicaUsuarioService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    addIcons({ accessibilityOutline, chevronBackOutline, personOutline, eyeOutline });
  }

  ngOnInit() {
    const token = this.tokenService.extrair();
    this.usuarioId = token.id;
    this.isProfissional = token.tipo === 'PROFISSIONAL';

    this.carregarDados();
  }

  private carregarDados() {
    this.carregando = true;

    forkJoin({
      caracteristicas: this.caracteristicaService.listar(),
      minhas: this.caracteristicaUsuarioService
        .listarPorUsuario(this.usuarioId)
        .pipe(catchError(() => of([] as CaracteristicaUsuarioModel[]))),
    }).subscribe({
      next: ({ caracteristicas, minhas }) => {
        this.todasCaracteristicas = caracteristicas;
        this.minhasCaracteristicas = new Map(minhas.map(cu => [cu.idCaracteristica, cu]));
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.exibirMensagem('Não foi possível carregar suas características. Tente novamente.');
      },
    });
  }

  // ── Leitura do estado atual ───────────────────────────────

  tem(carac: CaracteristicaModel): boolean {
    return this.minhasCaracteristicas.get(carac.id)?.tem ?? false;
  }

  sabeAtender(carac: CaracteristicaModel): boolean {
    return this.minhasCaracteristicas.get(carac.id)?.lida ?? false;
  }

  // ── Alternar "tem" / "sabe atender" ───────────────────────
  // Cada característica tem uma única linha no backend guardando os dois
  // campos juntos. Por isso, alternar um não pode simplesmente apagar a
  // linha inteira se o outro campo ainda estiver marcado — só remove de
  // vez quando os dois ficam desmarcados.

  toggleTem(carac: CaracteristicaModel) {
    this.alternar(carac, 'tem');
  }

  toggleSabeAtender(carac: CaracteristicaModel) {
    if (!this.isProfissional) return; // clientes não têm essa opção
    this.alternar(carac, 'lida');
  }

  private alternar(carac: CaracteristicaModel, campo: 'tem' | 'lida') {
    if (this.processando[carac.id]) return;
    this.processando[carac.id] = true;

    const existente = this.minhasCaracteristicas.get(carac.id);
    const temAtual = existente?.tem ?? false;
    const lidaAtual = existente?.lida ?? false;

    const novoTem = campo === 'tem' ? !temAtual : temAtual;
    const novaLida = campo === 'lida' ? !lidaAtual : lidaAtual;

    // Nada existia e o novo valor também é "desligado": não há o que fazer.
    if (!existente && !novoTem && !novaLida) {
      delete this.processando[carac.id];
      return;
    }

    // Os dois campos ficaram desligados: apaga o vínculo por completo.
    if (existente && !novoTem && !novaLida) {
      this.caracteristicaUsuarioService
        .excluirPorCaracteristicaUsuario(carac.id, this.usuarioId)
        .subscribe({
          next: () => {
            this.minhasCaracteristicas.delete(carac.id);
            delete this.processando[carac.id];
          },
          error: () => {
            delete this.processando[carac.id];
            this.exibirMensagem('Não foi possível atualizar. Tente novamente.');
          },
        });
      return;
    }

    // Já existe o vínculo: só atualiza os campos.
    if (existente) {
      const atualizado = { ...existente, tem: novoTem, lida: novaLida };
      this.caracteristicaUsuarioService.atualizar(existente.id, atualizado).subscribe({
        next: (cu) => {
          this.minhasCaracteristicas.set(carac.id, cu);
          delete this.processando[carac.id];
        },
        error: () => {
          delete this.processando[carac.id];
          this.exibirMensagem('Não foi possível atualizar. Tente novamente.');
        },
      });
      return;
    }

    // Ainda não existe: cria o vínculo agora.
    const novo = new CaracteristicaUsuarioModel();
    novo.idUsuario = this.usuarioId;
    novo.idCaracteristica = carac.id;
    novo.tem = novoTem;
    novo.lida = novaLida;

    this.caracteristicaUsuarioService.salvar(novo).subscribe({
      next: (cu) => {
        this.minhasCaracteristicas.set(carac.id, cu);
        delete this.processando[carac.id];
      },
      error: () => {
        delete this.processando[carac.id];
        this.exibirMensagem('Não foi possível salvar. Tente novamente.');
      },
    });
  }

  voltar() {
    this.navController.navigateForward('/tabs/perfil');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
}
