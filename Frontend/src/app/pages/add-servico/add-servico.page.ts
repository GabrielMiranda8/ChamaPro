import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonButton, IonIcon, IonInput, IonTextarea, ToastController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  briefcaseOutline, addOutline, arrowForwardOutline, trashOutline,
  pricetagOutline, timeOutline, chevronBackOutline, checkmarkCircleOutline,
} from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ServicoModel } from 'src/app/model/servico.model';
import { ServicoService } from 'src/app/services/servico.service';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ProfissionalServicoResponse, ProfissionalServicoService } from 'src/app/services/profissional-servico.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-servico',
  templateUrl: './add-servico.page.html',
  styleUrls: ['./add-servico.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonButton, IonIcon, IonInput, IonTextarea,
  ],
})
export class AddServicoPage implements OnInit {
  idProfissional = '';
  carregando = false;

  todosServicos: ServicoModel[] = [];
  meusServicos: ProfissionalServicoResponse[] = [];

  idServicoSelecionado = '';
  novoNomeServico = '';
  novaDescricaoServico = '';
  preco: number | null = null;
  tempoCarreira = '';

  constructor(
    private servicoService: ServicoService,
    private profissionalServicoService: ProfissionalServicoService,
    private tokenService: TokenService,
    private toastController: ToastController,
    private alertController: AlertController,
    private navController: NavController,
    private activatedRoute: ActivatedRoute,
  ) {
    addIcons({
      briefcaseOutline, addOutline, arrowForwardOutline, trashOutline,
      pricetagOutline, timeOutline, chevronBackOutline, checkmarkCircleOutline,
    });
  }

  ngOnInit() {
    const token = this.tokenService.extrair();
    this.idProfissional = this.activatedRoute.snapshot.params['id'] || token.id;

    if (!this.idProfissional) {
      this.exibirMensagem('Faça login novamente para gerenciar seus serviços.');
      this.navController.navigateRoot('/login');
      return;
    }

    this.carregarDados();
  }

  carregarDados() {
    this.carregando = true;

    this.servicoService.listar().subscribe({
      next: (servicos) => {
        this.todosServicos = servicos;
        this.carregarMeusServicos();
      },
      error: () => {
        this.carregando = false;
        this.exibirMensagem('Não consegui carregar os serviços cadastrados.');
      },
    });
  }

  carregarMeusServicos() {
    this.profissionalServicoService.buscarPorProfissional(this.idProfissional).subscribe({
      next: (resposta) => {
        this.meusServicos = resposta;
        this.carregando = false;
      },
      error: () => {
        this.meusServicos = [];
        this.carregando = false;
      },
    });
  }

  jaAdicionado(servicoId: string): boolean {
    return this.meusServicos.some((item) => item.servicoId === servicoId);
  }

  selecionarServico(id: string) {
    this.idServicoSelecionado = id;
    this.novoNomeServico = '';
    this.novaDescricaoServico = '';
  }

  async adicionarServico() {
    if (!this.preco || this.preco <= 0) {
      this.exibirMensagem('Informe um preço válido.');
      return;
    }

    const dataInicio = this.tempoCarreira || new Date().toISOString().slice(0, 10);

    if (this.novoNomeServico.trim()) {
      const novo = new ServicoModel();
      novo.nome = this.novoNomeServico.trim();
      novo.descricao = this.novaDescricaoServico.trim() || 'Serviço oferecido pelo profissional.';

      this.servicoService.salvar(novo).subscribe({
        next: (servicoCriado) => this.vincularServico(servicoCriado.id, dataInicio),
        error: () => this.exibirMensagem('Não consegui criar esse serviço. Veja se ele já existe.'),
      });
      return;
    }

    if (!this.idServicoSelecionado) {
      this.exibirMensagem('Selecione um serviço ou cadastre um novo.');
      return;
    }

    if (this.jaAdicionado(this.idServicoSelecionado)) {
      this.exibirMensagem('Esse serviço já está no seu perfil.');
      return;
    }

    this.vincularServico(this.idServicoSelecionado, dataInicio);
  }

  vincularServico(idServico: string, dataInicio: string) {
    const ps = new ProfissionalServicoModel();
    ps.idProfissional = this.idProfissional;
    ps.idServico = idServico;
    ps.preco = Number(this.preco);
    ps.tempoCarreira = new Date(`${dataInicio}T00:00:00`);

    this.profissionalServicoService.salvar(ps).subscribe({
      next: () => {
        this.exibirMensagem('Serviço adicionado ao seu perfil!');
        this.limparFormulario();
        this.carregarDados();
      },
      error: () => this.exibirMensagem('Não consegui adicionar. Talvez esse serviço já esteja no seu perfil.'),
    });
  }

  async confirmarExcluir(item: ProfissionalServicoResponse) {
    const alert = await this.alertController.create({
      header: 'Remover serviço',
      message: `Remover ${item.servicoNome} do seu perfil?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Remover', role: 'destructive', handler: () => this.excluir(item) },
      ],
    });
    await alert.present();
  }

  excluir(item: ProfissionalServicoResponse) {
    this.profissionalServicoService.excluir(item.id).subscribe({
      next: () => {
        this.exibirMensagem('Serviço removido.');
        this.carregarMeusServicos();
      },
      error: () => this.exibirMensagem('Não consegui remover esse serviço.'),
    });
  }

  limparFormulario() {
    this.idServicoSelecionado = '';
    this.novoNomeServico = '';
    this.novaDescricaoServico = '';
    this.preco = null;
    this.tempoCarreira = '';
  }

  continuar() {
    this.navController.navigateRoot('/tabs/perfil');
  }

  voltar() {
    this.navController.navigateRoot('/tabs/perfil');
  }

  async exibirMensagem(texto: string) {
    const toast = await this.toastController.create({
      message: texto,
      duration: 2200,
      position: 'bottom',
    });
    toast.present();
  }
}
