import { Injectable } from '@angular/core';
import { CaracteristicaService } from './caracteristica.service';
import { ServicoService } from './servico.service';

@Injectable({
  providedIn: 'root',
})
export class SeedService {
  constructor(
    private caracteristicaService: CaracteristicaService,
    private servicoService: ServicoService,
  ) {}

  inicializar() {
    this.seedCaracteristicas();
    this.seedServicos();
  }

  private seedCaracteristicas() {
    // Só insere se ainda não existir
    if (this.caracteristicaService.listar().length > 0) return;

    const defaults = [
      { id: '', nome: 'Cadeirante', descricao: 'Não se locomove com facilidade' },
      { id: '', nome: 'Baixa visão', descricao: 'Não enxerga com facilidade'  },
      { id: '', nome: 'Deficiência auditiva', descricao: 'Não escuta com facilidade'  },
    ];

    defaults.forEach(c => this.caracteristicaService.salvar(c));
  }

  private seedServicos(): void {
    if (this.servicoService.listar().length > 0) return;

    const defaults = [
      { id: '', nome: 'Elétrica Residencial',    descricao: 'Elétrica para casas' },
      { id: '', nome: 'Quadro Elétrico',  descricao: 'Manutenção e Confeccção de Quadros Elétricos' },
      { id: '', nome: 'Energia Solar',     descricao: 'Instalação e Manutenção de painéis solares' },
      { id: '', nome: 'Elétrica Comercial/Industrial',     descricao: 'Elétrica para ambientes extensos como Indústrias e Prédios' },
      { id: '', nome: 'Elétrica de Segurança',     descricao: 'Especializado em Segurança como cercas, câmeras e etc' },
      { id: '', nome: 'Iluminação',     descricao: 'Iluminação e derivados' },
      { id: '', nome: 'Infraestrutura',     descricao: 'Elétrica focada em cabeamentos' },
    ];

    defaults.forEach(s => this.servicoService.salvar(s));
  }
}
