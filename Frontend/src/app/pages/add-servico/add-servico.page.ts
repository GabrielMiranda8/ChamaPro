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
  bodyOutline, micOutline, chatbubbleOutline,
} from 'ionicons/icons';
import { NavController } from '@ionic/angular';
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

  // Agora obtido do token JWT do usuário logado, e não mais de um :id na rota
  usuarioId!: string;

  todosServicos: ServicoModel[] = [];
  // todasCaracteristicas: CaracteristicaModel[] = []; // TODO: ainda não implementado no backend

  servicosSelecionados: ServicoModel[] = [];
  // caracsSelecionadas: CaracteristicaModel[] = []; // TODO: ainda não implementado no backend

  // Cada serviço selecionado tem seu próprio preço por hora — o mesmo
  // profissional pode cobrar valores diferentes dependendo do serviço.
  // Chave: id do serviço, valor: preço digitado (null enquanto vazio).
  precos: Record<string, number | null> = {};

  // Exigido pelo backend (ProfissionalServico.tempoCarreira, nullable = false).
  // Esse é único por profissional (não por serviço).
  tempoCarreira = ''; // formato yyyy-mm-dd (input type="date")

  carregando = true;
  salvando = false;

  constructor(
    private servicoService: ServicoService,
    // private caracteristicaService: CaracteristicaService, // TODO: ainda não implementado no backend
    private profissionalServicoService: ProfissionalServicoService,
    private toastController: ToastController,
    private navController: NavController,
    private tokenService: TokenService,
  ) {
    addIcons({
      briefcaseOutline, arrowForwardOutline, chevronBackOutline,
      handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
      bodyOutline, micOutline, chatbubbleOutline,
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
      // caracteristicas: this.caracteristicaService.listar(), // TODO: ainda não implementado no backend
      // já cadastrados antes, para permitir editar em vez de duplicar
      meusServicos: this.profissionalServicoService
        .buscarPorProfissional(this.usuarioId)
        .pipe(catchError(() => of([] as ProfissionalServicoModel[]))),
    }).subscribe({
      next: ({ servicos, meusServicos }) => {
        this.todosServicos = servicos;
        // this.todasCaracteristicas = caracteristicas; // TODO: ainda não implementado no backend

        // Pré-seleciona os serviços já cadastrados antes e recupera o preço
        // e o tempo de carreira que o profissional já tinha informado.
        const precoPorServico = new Map(meusServicos.map(ms => [ms.idServico, ms.preco]));
        this.servicosSelecionados = this.todosServicos.filter(s => precoPorServico.has(s.id));
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
      this.servicosSelecionados = this.servicosSelecionados.filter(s => s.id !== servico.id);
      delete this.precos[servico.id];
    } else {
      this.servicosSelecionados.push(servico);
      this.precos[servico.id] = null;
    }
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
