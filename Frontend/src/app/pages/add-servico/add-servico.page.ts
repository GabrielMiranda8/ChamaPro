import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonInput, IonSpinner, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline, addOutline, arrowForwardOutline,
  handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
  bodyOutline, micOutline, chatbubbleOutline,
} from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
import { CaracteristicaModel } from 'src/app/model/caracteristica.model';
import { CaracteristicaService } from 'src/app/services/caracteristica.service';
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
  todasCaracteristicas: CaracteristicaModel[] = [];

  servicosSelecionados: ServicoModel[] = [];
  caracsSelecionadas: CaracteristicaModel[] = [];
  outraEspecialidade = '';

  carregando = true;
  salvando = false;

  constructor(
    private servicoService: ServicoService,
    private caracteristicaService: CaracteristicaService,
    private profissionalServicoService: ProfissionalServicoService,
    private toastController: ToastController,
    private navController: NavController,
    private tokenService: TokenService,
  ) {
    addIcons({
      briefcaseOutline, addOutline, arrowForwardOutline,
      handLeftOutline, eyeOutline, earOutline, accessibilityOutline,
      bodyOutline, micOutline, chatbubbleOutline,
    });
  }

  ngOnInit() {
    const token = this.tokenService.extrair();
    this.usuarioId = token.id;

    // Página exclusiva para profissionais logados
    if (token.tipo !== 'PROFISSIONAL') {
      this.navController.navigateRoot('/perfil');
      return;
    }

    this.carregarDados();
  }

  private carregarDados() {
    this.carregando = true;

    forkJoin({
      servicos: this.servicoService.listar(),
      caracteristicas: this.caracteristicaService.listar(),
      
      meusServicos: this.profissionalServicoService
        .buscarPorProfissional(this.usuarioId)
    }).subscribe({
      next: ({ servicos, caracteristicas, meusServicos }) => {
        this.todosServicos = servicos;
        this.todasCaracteristicas = caracteristicas;

        const idsJaSelecionados = new Set(meusServicos.map(ms => ms.idServico));
        this.servicosSelecionados = this.todosServicos.filter(s => idsJaSelecionados.has(s.id));

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
    } else {
      this.servicosSelecionados.push(servico);
    }
  }

  adicionarOutra() {
    const nome = this.outraEspecialidade.trim();
    if (!nome) return;
    const novoServico = new ServicoModel();
    novoServico.nome = nome;
    this.servicosSelecionados.push(novoServico);
    this.outraEspecialidade = '';
  }

  // ── Seleção de características ───────────────────────────

  isCaracSelecionada(carac: CaracteristicaModel): boolean {
    return this.caracsSelecionadas.some(c => c.id === carac.id);
  }

  toggleCarac(carac: CaracteristicaModel) {
    if (this.isCaracSelecionada(carac)) {
      this.caracsSelecionadas = this.caracsSelecionadas.filter(c => c.id !== carac.id);
    } else {
      this.caracsSelecionadas.push(carac);
    }
  }

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

    this.salvando = true;

    const chamadas = this.servicosSelecionados.map(s => {
      const ps = new ProfissionalServicoModel();
      ps.idServico = s.id;
      ps.idProfissional = this.usuarioId;
      return this.profissionalServicoService.salvar(ps);
    });

    forkJoin(chamadas).subscribe({
      next: async () => {
        this.salvando = false;
        await this.exibirMensagem('Serviços salvos com sucesso!');
        // Usuário já está logado: volta para o perfil, não para o login
        this.navController.navigateRoot('/perfil');
      },
      error: async () => {
        this.salvando = false;
        await this.exibirMensagem('Erro ao salvar os serviços. Tente novamente.');
      },
    });
  }

  pular() {
    this.navController.navigateRoot('/perfil');
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