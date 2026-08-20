import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonInput, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline, arrowForwardOutline, chevronBackOutline,
  handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
  bodyOutline, micOutline, chatbubbleOutline, trashOutline,
} from 'ionicons/icons';
import { AlertController, NavController } from '@ionic/angular';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
// import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
// import { CaracteristicaService } from 'src/app/services/caracteristica.service';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-servico',
  templateUrl: './add-servico.page.html',
  styleUrls: ['./add-servico.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonIcon, IonInput, IonSpinner,
  ],
})
export class AddServicoPage implements OnInit {


  usuarioId!: string;

  todosServicos: ServicoModel[] = [];
  // todasCaracteristicas: CaracteristicaModel[] = []; A FAZER

  servicosSelecionados: ServicoModel[] = [];
  // caracsSelecionadas: CaracteristicaModel[] = []; A FAZER 

  precos: Record<string, number | null> = {};

  // Ids dos serviços que já existem salvos no backend (vieram do
  // carregarDados). Usado pra saber se "excluir" precisa chamar a API
  // ou só desmarcar localmente um serviço que ainda nem foi salvo.
  idsSalvos = new Set<string>();

  tempoCarreira = ''; // formato yyyy-mm-dd (input type="date")

  carregando = true;
  salvando = false;
  excluindo: Record<string, boolean> = {};

  constructor(
    private servicoService: ServicoService,
    // private caracteristicaService: CaracteristicaService, A FAZER
    private profissionalServicoService: ProfissionalServicoService,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private tokenService: TokenService,
  ) {
    addIcons({
      briefcaseOutline, arrowForwardOutline, chevronBackOutline,
      handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
      bodyOutline, micOutline, chatbubbleOutline, trashOutline,
    });
  }

  ngOnInit() {
    const token = this.tokenService.extrair();
    this.usuarioId = token.id;

    // Página exclusiva para profissionais logados
    if (token.tipo !== 'PROFISSIONAL') {
      this.navController.navigateRoot('/tabs/perfil');
      return;
    }

    this.carregarDados();
  }

  private carregarDados() {
    this.carregando = true;

    forkJoin({
      servicos: this.servicoService.listar(),
      // caracteristicas: this.caracteristicaService.listar(), // A FAZER
      // já cadastrados antes, para permitir editar em vez de duplicar
      meusServicos: this.profissionalServicoService
        .buscarPorProfissional(this.usuarioId)
        .pipe(catchError(() => of([] as ProfissionalServicoModel[]))),
    }).subscribe({
      next: ({ servicos, meusServicos }) => {
        this.todosServicos = servicos;
        // this.todasCaracteristicas = caracteristicas; // A FAZER

        // Pré-seleciona os serviços já cadastrados antes e recupera o preço
        // e o tempo de carreira que o profissional já tinha informado.
        const precoPorServico = new Map(meusServicos.map(ms => [ms.idServico, ms.preco]));
        this.servicosSelecionados = this.todosServicos.filter(s => precoPorServico.has(s.id));
        this.idsSalvos = new Set(precoPorServico.keys());
        for (const servico of this.servicosSelecionados) {
          this.precos[servico.id] = precoPorServico.get(servico.id) ?? null;
        }

        const primeiroComTempo = meusServicos.find(ms => ms.tempoCarreira);
        if (primeiroComTempo) {
          this.tempoCarreira = new Date(primeiroComTempo.tempoCarreira).toISOString().split('T')[0];
        }

        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.exibirMensagem('Não foi possível carregar os serviços. Tente novamente.');
      },
    });
  }

  // ── Seleção de serviços ──────────────────────────────────

  isServicoSelecionado(servico: ServicoModel): boolean {
    return this.servicosSelecionados.some(s => s.id === servico.id);
  }

  toggleServico(servico: ServicoModel) {
    if (this.isServicoSelecionado(servico)) {
      // Serviço já salvo no backend: desmarcar o chip sozinho deixaria a
      // tela e o banco dessincronizados (ele voltaria ao recarregar a
      // página). Por isso passa pelo mesmo fluxo de exclusão com confirmação.
      if (this.idsSalvos.has(servico.id)) {
        this.excluirServico(servico);
        return;
      }
      this.servicosSelecionados = this.servicosSelecionados.filter(s => s.id !== servico.id);
      delete this.precos[servico.id];
    } else {
      this.servicosSelecionados.push(servico);
      this.precos[servico.id] = null;
    }
  }

  // ── Exclusão de serviço já salvo ──────────────────────────

  async excluirServico(servico: ServicoModel) {
    const alert = await this.alertController.create({
      header: 'Remover serviço',
      message: `Tem certeza que deseja remover "${servico.nome}" da sua lista de especialidades?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Remover',
          role: 'destructive',
          handler: () => this.confirmarExclusao(servico),
        },
      ],
    });
    await alert.present();
  }

  private confirmarExclusao(servico: ServicoModel) {
    this.excluindo[servico.id] = true;

    this.profissionalServicoService.excluirPorProfissionalServico(this.usuarioId, servico.id).subscribe({
      next: () => {
        this.servicosSelecionados = this.servicosSelecionados.filter(s => s.id !== servico.id);
        delete this.precos[servico.id];
        this.idsSalvos.delete(servico.id);
        delete this.excluindo[servico.id];
        this.exibirMensagem(`"${servico.nome}" removido com sucesso.`);
      },
      error: () => {
        delete this.excluindo[servico.id];
        this.exibirMensagem(`Não foi possível remover "${servico.nome}". Tente novamente.`);
      },
    });
  }

  // Removido: adicionarOutra() permitia texto livre, o que gerava serviços sem
  // id real no catálogo (idServico vazio quebrava o POST pro backend). Agora o
  // usuário só pode selecionar entre os serviços já cadastrados no sistema.

  // ── Seleção de características (TODO: ainda não implementado no backend) ──

  // isCaracSelecionada(carac: CaracteristicaModel): boolean {
  //   return this.caracsSelecionadas.some(c => c.id === carac.id);
  // }

  // toggleCarac(carac: CaracteristicaModel) {
  //   if (this.isCaracSelecionada(carac)) {
  //     this.caracsSelecionadas = this.caracsSelecionadas.filter(c => c.id !== carac.id);
  //   } else {
  //     this.caracsSelecionadas.push(carac);
  //   }
  // }

  iconePorCaracteristica(nome: string): string {
    const mapa: Record<string, string> = {
      'libras': 'hand-left-outline',
      'visual': 'eye-outline',
      'auditiva': 'ear-outline',
      'cognitiva': 'accessibility-outline',
      'motora': 'body-outline',
      'audiodescrição': 'mic-outline',
      'leitura labial': 'chatbubble-outline',
    };
    const chave = Object.keys(mapa).find(k => nome.toLowerCase().includes(k));
    return chave ? mapa[chave] : 'accessibility-outline';
  }

  // ── Salvar ───────────────────────────────────────────────

  async salvar() {
    if (this.servicosSelecionados.length === 0) {
      await this.exibirMensagem('Selecione ao menos um serviço.');
      return;
    }

    const servicoSemPreco = this.servicosSelecionados.find(
      s => this.precos[s.id] === null || this.precos[s.id] === undefined || this.precos[s.id]! <= 0,
    );
    if (servicoSemPreco) {
      await this.exibirMensagem(`Informe o preço por hora de "${servicoSemPreco.nome}".`);
      return;
    }

    if (!this.tempoCarreira) {
      await this.exibirMensagem('Informe desde quando você atua na área.');
      return;
    }

    this.salvando = true;

    const chamadas = this.servicosSelecionados.map(s => {
      const ps = new ProfissionalServicoModel();
      ps.idServico = s.id;
      ps.idProfissional = this.usuarioId;
      ps.preco = this.precos[s.id]!;
      ps.tempoCarreira = new Date(this.tempoCarreira); // input devolve string yyyy-mm-dd; model espera Date
      return this.profissionalServicoService.salvar(ps);
    });

    forkJoin(chamadas).subscribe({
      next: async () => {
        this.salvando = false;
        await this.exibirMensagem('Serviços salvos com sucesso!');
        // Usuário já está logado: volta para o perfil, não para o login
        this.navController.navigateRoot('/tabs/perfil');
      },
      error: async () => {
        this.salvando = false;
        await this.exibirMensagem('Erro ao salvar os serviços. Tente novamente.');
      },
    });
  }

  voltar() {
    this.navController.navigateRoot('/tabs/perfil');
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
