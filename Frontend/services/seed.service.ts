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
    this.servicoService.listar().subscribe((servicos) => {
      if (servicos.length > 0) return;

      const defaults = [
        { id: '', nome: 'Elétrica Residencial', descricao: 'Elétrica para casas' },
        { id: '', nome: 'Quadro Elétrico', descricao: 'Manutenção e Confecção de quadros elétricos' },
        { id: '', nome: 'Energia Solar', descricao: 'Instalação e manutenção de painéis solares' },
        { id: '', nome: 'Elétrica Comercial/Industrial', descricao: 'Elétrica para indústrias, lojas e prédios' },
        { id: '', nome: 'Elétrica de Segurança', descricao: 'Cercas, câmeras e sistemas de segurança' },
        { id: '', nome: 'Iluminação', descricao: 'Instalação e manutenção de iluminação' },
        { id: '', nome: 'Infraestrutura', descricao: 'Cabeamento e infraestrutura elétrica' },
      ];

      defaults.forEach(s => this.servicoService.salvar(s).subscribe());
    });
  }
}
