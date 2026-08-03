import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController, ToastController } from '@ionic/angular';
import { IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  accessibilityOutline, chevronBackOutline, personOutline, eyeOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';
import { CaracteristicaUsuarioModel } from 'src/app/model/caracteristica-usuario.model';
import { CaracteristicaUsuarioService } from 'src/app/services/caracteristica-usuario.service';
import { TokenService } from 'src/app/services/token.service';

// Estado local de uma característica: o que o usuário marcou na tela,
// ainda sem necessariamente ter sido salvo no backend.
interface EstadoCaracteristica {
  tem: boolean;
  lida: boolean;
}

@Component({
  selector: 'app-add-caracteristica',
  templateUrl: './add-caracteristica.page.html',
  styleUrls: ['./add-caracteristica.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonSpinner],
})
export class AddCaracteristicaPage implements OnInit {

  usuarioId!: string;
  isProfissional = false;

  todasCaracteristicas: CaracteristicaModel[] = [];

  // O que veio do backend da última vez (carregamento ou salvamento).
  // Serve de "linha de base" pra saber o que realmente mudou na hora de salvar.
  private original = new Map<string, CaracteristicaUsuarioModel>();

  // O que está marcado na tela agora — só isso muda quando o usuário clica
  // num chip. Nenhuma requisição sai daqui, só no botão "Salvar".
  estado = new Map<string, EstadoCaracteristica>();

  carregando = true;
  salvando = false;

  constructor(
    private caracteristicaService: CaracteristicaService,
    private caracteristicaUsuarioService: CaracteristicaUsuarioService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private navController: NavController,
  ) {
    addIcons({
      accessibilityOutline, chevronBackOutline, personOutline, eyeOutline,
      arrowForwardOutline,
    });
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
        this.aplicarSnapshot(minhas);
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.exibirMensagem('Não foi possível carregar suas características. Tente novamente.');
      },
    });
  }

  // Recria "original" e "estado" a partir do que o backend realmente tem
  // salvo — usado no carregamento inicial e de novo depois de salvar.
  private aplicarSnapshot(minhas: CaracteristicaUsuarioModel[]) {
    this.original = new Map(minhas.map(cu => [cu.idCaracteristica, cu]));
    this.estado = new Map(
      minhas.map(cu => [cu.idCaracteristica, { tem: cu.tem, lida: cu.lida }]),
    );
  }

  // ── Leitura do estado local (o que está marcado na tela) ──

  tem(carac: CaracteristicaModel): boolean {
    return this.estado.get(carac.id)?.tem ?? false;
  }

  sabeAtender(carac: CaracteristicaModel): boolean {
    return this.estado.get(carac.id)?.lida ?? false;
  }

  // Se tem alguma diferença entre o que está na tela e o que já foi salvo —
  // usado pra habilitar o botão "Salvar" e avisar se der pra sair sem perder nada.
  get temAlteracoesPendentes(): boolean {
    for (const carac of this.todasCaracteristicas) {
      const atual = this.estado.get(carac.id) ?? { tem: false, lida: false };
      const salvo = this.original.get(carac.id);
      const temSalvo = salvo?.tem ?? false;
      const lidaSalvo = salvo?.lida ?? false;
      if (atual.tem !== temSalvo || atual.lida !== lidaSalvo) return true;
    }
    return false;
  }

  // ── Alternar "tem" / "sabe atender" (só na tela, sem chamar o backend) ──

  toggleTem(carac: CaracteristicaModel) {
    const atual = this.estado.get(carac.id) ?? { tem: false, lida: false };
    this.estado.set(carac.id, { ...atual, tem: !atual.tem });
  }

  toggleSabeAtender(carac: CaracteristicaModel) {
    if (!this.isProfissional) return; // clientes não têm essa opção
    const atual = this.estado.get(carac.id) ?? { tem: false, lida: false };
    this.estado.set(carac.id, { ...atual, lida: !atual.lida });
  }

  // ── Salvar tudo de uma vez ─────────────────────────────────
  // Só manda requisição pra característica que realmente mudou desde o
  // último carregamento/salvamento — evita criar, atualizar ou excluir
  // à toa no banco.

  async salvar() {
    if (this.salvando || !this.temAlteracoesPendentes) return;
    this.salvando = true;

    const chamadas: Observable<unknown>[] = [];

    for (const carac of this.todasCaracteristicas) {
      const atual = this.estado.get(carac.id) ?? { tem: false, lida: false };
      const salvo = this.original.get(carac.id);
      const temSalvo = salvo?.tem ?? false;
      const lidaSalvo = salvo?.lida ?? false;

      if (atual.tem === temSalvo && atual.lida === lidaSalvo) continue; // nada mudou aqui

      if (!salvo && (atual.tem || atual.lida)) {
        // Não existia vínculo nenhum, e agora tem algo marcado: cria.
        const novo = new CaracteristicaUsuarioModel();
        novo.idUsuario = this.usuarioId;
        novo.idCaracteristica = carac.id;
        novo.tem = atual.tem;
        novo.lida = atual.lida;
        chamadas.push(this.caracteristicaUsuarioService.salvar(novo));
      } else if (salvo && !atual.tem && !atual.lida) {
        // Existia, e os dois campos ficaram desmarcados: apaga de vez.
        chamadas.push(
          this.caracteristicaUsuarioService.excluirPorCaracteristicaUsuario(carac.id, this.usuarioId),
        );
      } else if (salvo) {
        // Existia e algum dos campos mudou, mas ainda sobrou algo marcado: atualiza.
        const atualizado = { ...salvo, tem: atual.tem, lida: atual.lida };
        chamadas.push(this.caracteristicaUsuarioService.atualizar(salvo.id, atualizado));
      }
    }

    if (chamadas.length === 0) {
      this.salvando = false;
      return;
    }

    forkJoin(chamadas).pipe(
      catchError(() => of(null)), // mesmo se uma falhar, recarrega pra ver o que realmente ficou salvo
    ).subscribe(() => {
      this.caracteristicaUsuarioService.listarPorUsuario(this.usuarioId).subscribe({
        next: (minhas) => {
          this.aplicarSnapshot(minhas);
          this.salvando = false;
          this.exibirMensagem('Características salvas com sucesso!');
        },
        error: () => {
          this.salvando = false;
          this.exibirMensagem('Salvo, mas não foi possível confirmar o resultado. Recarregue a página.');
        },
      });
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
