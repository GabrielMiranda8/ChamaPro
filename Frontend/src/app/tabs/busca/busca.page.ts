import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, handLeftOutline, star, locationOutline, navigateOutline } from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { UsuarioService } from 'src/app/services/usuario.service';
import { ServicoService } from 'src/app/services/servico.service';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ServicoModel } from 'src/app/model/servico.model';

import { ProfissionalPopupComponent } from 'src/app/components/profissional-popup/profissional-popup.component';
import { EnderecoService } from 'src/app/services/endereco.service';
import { EnderecoModel } from 'src/app/model/endereco.model';
import { LocalizacaoService, PosicaoModel } from 'src/app/services/localizacao.service';


interface ResultadoBusca {
  ps: ProfissionalServicoModel;
  profissional: UsuarioModel;
  servico: ServicoModel;
  distanciaKm: number | null;   // null = profissional sem coordenadas
}

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonIcon,
    CommonModule,
    FormsModule,
  ],
})
export class BuscaPage implements OnInit {
  textoBusca = '';
  filtroSelecionado = 'todos';
  carregando = true;
  resultados: ResultadoBusca[] = [];
  resultadosFiltrados: ResultadoBusca[] = [];
  enderecos: EnderecoModel[] = [];
  posicaoReferencia: PosicaoModel | null = null;
  origemPosicao = ''; // 'gps', 'endereco' ou '' (sem referência)
  buscandoGps = false;


  constructor(
    private usuarioService: UsuarioService,
    private servicoService: ServicoService,
    private profissionalServicoService: ProfissionalServicoService,
    private modalCtrl: ModalController,
    private localizacaoService: LocalizacaoService,
    private enderecoService: EnderecoService,
  ) {
    addIcons({ searchOutline, handLeftOutline, star, locationOutline, navigateOutline });
  }

  ngOnInit(): void {
    this.carregarResultados();
  }

  // Loading

  carregarResultados(): void {
    this.carregando = true;

    forkJoin({
      profissionalServicos: this.profissionalServicoService.listar(),
      usuarios: this.usuarioService.listar(),
      servicos: this.servicoService.listar(),
      enderecos: this.enderecoService.listar(),
    }).subscribe({
      next: async ({ profissionalServicos, usuarios, servicos, enderecos }) => {
        this.enderecos = enderecos;

        const usuarioLogado = this.usuarioService.getUsuarioLogado();
        const lista: ResultadoBusca[] = [];

        for (const ps of profissionalServicos) {
          let profissional: UsuarioModel | null = null;
          for (const u of usuarios) {
            if (u.id === ps.idProfissional) {
              profissional = u;
              break;
            }
          }

          let servico: ServicoModel | null = null;
          for (const s of servicos) {
            if (s.id === ps.idServico) {
              servico = s;
              break;
            }
          }

          if (profissional === null || servico === null) {
            continue;
          }

          // exclui o próprio usuário logado
          if (profissional.id === usuarioLogado.id) {
            continue;
          }

          lista.push({ ps, profissional, servico, distanciaKm: null });
        }

        this.resultados = lista;
        this.carregando = false;

        await this.definirPosicaoReferencia(false);
      },
      error: (err) => {
        console.log('Erro ao carregar resultados de busca:', err);
        this.resultados = [];
        this.resultadosFiltrados = [];
        this.carregando = false;
      },
    });
  }
  // Filtros 

  selecionarFiltro(filtro: string): void {
    this.filtroSelecionado = filtro;
    this.filtrarResultados();
  }

  filtrarResultados(): void {
    let lista = [...this.resultados];
    const termo = this.textoBusca.trim().toLowerCase();

    // Filtro de texto
    if (termo) {
      lista = lista.filter(
        (item) =>
          item.profissional.nome.toLowerCase().includes(termo) ||
          item.servico.nome.toLowerCase().includes(termo) ||
          item.servico.descricao.toLowerCase().includes(termo),
      );
    }

    // Filtros de chip
    switch (this.filtroSelecionado) {
      case 'libras':
        lista = lista.filter((item) =>
          this.possuiCaracteristica(item.profissional, 'LIBRAS'),
        );
        break;
      case 'verificado':
        lista = lista.filter((item) =>
          this.possuiCaracteristica(item.profissional, 'VERIFICADO'),
        );
        break;
      case 'avaliacao':
        lista = [...lista].sort((a, b) => b.profissional.nota - a.profissional.nota);
        break;
    }
    if (this.filtroSelecionado !== 'avaliacao') {
      this.ordenarPorDistancia(lista);
    }
    this.resultadosFiltrados = lista;

  }

  // Popup do profissional (1 passo) 

  async abrirPopupProfissional(item: ResultadoBusca): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ProfissionalPopupComponent,
      componentProps: {
        profissional: item.profissional,
        profissionalServico: item.ps,
        servico: item.servico,
        cliente: this.usuarioService.getUsuarioLogado(),
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data?.sucesso) {
      console.log('Pedido criado:', data.pedido);
    }

    if (data?.abrirChat) {
      console.log('Abrir chat com:', item.profissional);
    }

    if (data?.verPerfil) {
      console.log('Ver perfil:', data.idProfissional);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  possuiCaracteristica(usuario: UsuarioModel, nome: string): boolean {
    return usuario.caracteristicas?.some(
      (c) => c.nome.toUpperCase() === nome.toUpperCase(),
    ) ?? false;
  }

  obterIniciais(nome: string): string {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((x) => x[0])
      .join('')
      .toUpperCase();
  }

  calcularAnos(data: Date): number {
    const inicio = new Date(data);
    const hoje = new Date();
    return hoje.getFullYear() - inicio.getFullYear();
  }

  // Tenta o GPS; se não conseguir, usa o endereço cadastrado do cliente logado.
  // forcarGps = true quando o usuário clicou no botão "Usar minha localização".
  async definirPosicaoReferencia(forcarGps: boolean): Promise<void> {
    this.buscandoGps = true;

    const posicaoGps = await this.localizacaoService.obterPosicaoAtual();

    if (posicaoGps !== null) {
      this.posicaoReferencia = posicaoGps;
      this.origemPosicao = 'gps';
    } else {
      if (forcarGps) {
        // Só avisa se o usuário pediu o GPS explicitamente e falhou.
        console.log('GPS indisponível, mantendo endereço cadastrado.');
      }
      this.usarEnderecoCadastradoComoReferencia();
    }

    this.buscandoGps = false;
    this.calcularDistancias();
    this.filtrarResultados();
  }

  private usarEnderecoCadastradoComoReferencia(): void {
    const usuarioLogado = this.usuarioService.getUsuarioLogado();

    for (const e of this.enderecos) {
      if (e.idUsuario === usuarioLogado.id && e.latitude !== null && e.longitude !== null) {
        this.posicaoReferencia = { latitude: e.latitude, longitude: e.longitude };
        this.origemPosicao = 'endereco';
        return;
      }
    }

    this.posicaoReferencia = null;
    this.origemPosicao = '';
  }

  private obterEnderecoDoUsuario(idUsuario: string): EnderecoModel | null {
    for (const e of this.enderecos) {
      if (e.idUsuario === idUsuario) {
        return e;
      }
    }
    return null;
  }

  private calcularDistancias(): void {
    for (const item of this.resultados) {
      if (this.posicaoReferencia === null) {
        item.distanciaKm = null;
        continue;
      }

      const endereco = this.obterEnderecoDoUsuario(item.profissional.id);

      if (endereco === null || endereco.latitude === null || endereco.longitude === null) {
        item.distanciaKm = null;
      } else {
        item.distanciaKm = this.localizacaoService.calcularDistanciaKm(
          this.posicaoReferencia.latitude,
          this.posicaoReferencia.longitude,
          endereco.latitude,
          endereco.longitude,
        );
      }
    }
  }

  // Bubble sort (mesmo padrão do pedidos.page.ts). Quem não tem distância vai pro fim.
  private ordenarPorDistancia(lista: ResultadoBusca[]): void {
    for (let i = 0; i < lista.length; i++) {
      for (let j = 0; j < lista.length - 1 - i; j++) {
        const atual = lista[j].distanciaKm;
        const proximo = lista[j + 1].distanciaKm;
        let deveTrocar = false;

        if (atual === null && proximo !== null) {
          deveTrocar = true;
        } else if (atual !== null && proximo !== null && atual > proximo) {
          deveTrocar = true;
        }

        if (deveTrocar) {
          const temp = lista[j];
          lista[j] = lista[j + 1];
          lista[j + 1] = temp;
        }
      }
    }
  }

  formatarDistancia(km: number): string {
    if (km < 1) {
      return Math.round(km * 1000) + ' m';
    }
    return km.toFixed(1).replace('.', ',') + ' km';
  }

  async usarMinhaLocalizacao(): Promise<void> {
    await this.definirPosicaoReferencia(true);
  }
}