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
import { searchOutline, handLeftOutline, star } from 'ionicons/icons';

import { UsuarioService } from 'src/app/services/usuario.service';
import { ServicoService } from 'src/app/services/servico.service';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';

import { UsuarioModel } from 'src/app/model/usuario.model';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ServicoModel } from 'src/app/model/servico.model';

import { ContratoComponent } from 'src/app/components/contrato/contrato.component';
import { ProfissionalPopupComponent } from 'src/app/components/profissional-popup/profissional-popup.component';

interface ResultadoBusca {
  ps: ProfissionalServicoModel;
  profissional: UsuarioModel;
  servico: ServicoModel;
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

  resultados: ResultadoBusca[] = [];
  resultadosFiltrados: ResultadoBusca[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private servicoService: ServicoService,
    private profissionalServicoService: ProfissionalServicoService,
    private modalCtrl: ModalController, // ← injetado corretamente
  ) {
    addIcons({ searchOutline, handLeftOutline, star });
  }

  ngOnInit(): void {
    this.carregarResultados();
  }

  // ─── Carregamento ───────────────────────────────────────────────────────────

  carregarResultados(): void {
    const profissionalServicos = this.profissionalServicoService.listar();

    this.resultados = profissionalServicos
      .map((ps) => {
        const profissional = this.usuarioService.buscarPorId(ps.idProfissional);
        const servico = this.servicoService.buscarPorId(ps.idServico);
        return { ps, profissional, servico };
      })
      // Filtra combinações incompletas (profissional ou serviço não encontrado)
      .filter((item) => item.profissional.id && item.servico.id);

    this.resultadosFiltrados = [...this.resultados];
    console.log("Resultados: ", this.resultados);
    console.log("Resultados Filtrados: ", this.resultadosFiltrados)
  }

  // ─── Filtros ────────────────────────────────────────────────────────────────

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
        lista.sort((a, b) => b.profissional.nota - a.profissional.nota);
        break;
    }

    this.resultadosFiltrados = lista;
  }

  // ─── Popup do profissional (1º passo) ──────────────────────────────────────

  async abrirPopupProfissional(item: ResultadoBusca): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: ProfissionalPopupComponent,
      componentProps: {
        profissional: item.profissional,
        profissionalServico: item.ps,
        servico: item.servico,
        cliente: this.usuarioService.getLogin(),
      },
      breakpoints: [0, 1],
      initialBreakpoint: 1,
      handle: false,
    });

    await modal.present();

    // Trata o que o popup devolveu ao fechar
    const { data } = await modal.onWillDismiss();

    if (data?.sucesso) {
      console.log('Pedido criado:', data.pedido);
      // Ex: navegar para aba de pedidos
    }

    if (data?.abrirChat) {
      console.log('Abrir chat com:', item.profissional);
      // Ex: this.router.navigate(['/tabs/chat', item.profissional.id]);
    }

    if (data?.verPerfil) {
      console.log('Ver perfil:', data.idProfissional);
      // Ex: this.router.navigate(['/tabs/profissional', data.idProfissional]);
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  possuiCaracteristica(usuario: UsuarioModel, nome: string): boolean {
    return usuario.caracteristicas.some(
      (c) => c.nome.toUpperCase() === nome.toUpperCase(),
    );
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
}