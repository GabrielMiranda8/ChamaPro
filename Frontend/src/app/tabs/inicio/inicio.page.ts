import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  locationOutline,
  bulbOutline,
  businessOutline,
  sunnyOutline,
  handLeftOutline,
  star
} from 'ionicons/icons';
import { TokenModel } from 'src/app/model/token.model';
import { UsuarioModel } from 'src/app/model/usuario.model';
import { TokenService } from 'src/app/services/token.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EnderecoModel } from 'src/app/model/endereco.model';
import { ProfissionalServicoModel } from 'src/app/model/profissional-servico.model';
import { ServicoModel } from 'src/app/model/servico.model';
import { LocalizacaoService, PosicaoModel } from 'src/app/services/localizacao.service';
import { forkJoin } from 'rxjs';
import { EnderecoService } from 'src/app/services/endereco.service';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';
import { ServicoService } from 'src/app/services/servico.service';

interface ResultadoBusca {
  ps: ProfissionalServicoModel;
  profissional: UsuarioModel;
  servico: ServicoModel;
  distanciaKm: number | null;   // null = profissional sem coordenadas
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {

  dados: UsuarioModel = new UsuarioModel();
  token!: TokenModel;
  textoBusca = '';
  filtroSelecionado = 'todos';
  carregando = true;
  resultados: ResultadoBusca[] = [];
  resultadosFiltrados: ResultadoBusca[] = [];
  enderecos: EnderecoModel[] = [];
  posicaoReferencia: PosicaoModel | null = null;
  origemPosicao = ''; // 'gps', 'endereco' ou '' (sem referência)
  buscandoGps = false;

  constructor(private router: Router, private tokenService: TokenService, private usuarioService: UsuarioService,
    private servicoService: ServicoService,
    private profissionalServicoService: ProfissionalServicoService,
    private localizacaoService: LocalizacaoService,
    private enderecoService: EnderecoService,) {
    addIcons({
      searchOutline,
      locationOutline,
      bulbOutline,
      businessOutline,
      sunnyOutline,
      handLeftOutline,
      star
    });
  }

  ngOnInit() {
    this.token = this.tokenService.extrair();
    this.usuarioService.buscarPorId(this.token.id).subscribe({
      next: (usuario) => {
        this.dados = usuario;
      },
      error: (err) => {
        console.log("Erro ao carregar dados de usuário: ", err);
      }
    })
    this.carregarResultados();
  }

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

        // Monta a lista com TODOS os profissionais (removemos o contador)
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

          if (profissional.id === usuarioLogado.id) {
            continue;
          }
          
          lista.push({ ps, profissional, servico, distanciaKm: null });
        }

        this.resultados = lista;
        this.carregando = false;
        
        // Vai calcular a distância, ordenar e cortar para os 3 mais próximos
        await this.definirPosicaoReferencia(false);
      },
      error: (err) => {
        console.log('Erro ao carregar resultados de busca:', err);
        this.resultados = [];
        this.carregando = false;
      },
    });
  }

  async definirPosicaoReferencia(forcarGps: boolean): Promise<void> {
    this.buscandoGps = true;

    const posicaoGps = await this.localizacaoService.obterPosicaoAtual();

    if (posicaoGps !== null) {
      this.posicaoReferencia = posicaoGps;
      this.origemPosicao = 'gps';
    } else {
      if (forcarGps) {
        console.log('GPS indisponível, mantendo endereço cadastrado.');
      }
      this.usarEnderecoCadastradoComoReferencia();
    }

    this.buscandoGps = false;
    
    // Calcula as distâncias de todo mundo
    this.calcularDistancias();
    
    // Ordena do mais próximo para o mais distante
    this.ordenarPorDistancia(this.resultados);
    
    // Corta o array para manter apenas os 3 primeiros
    this.resultados = this.resultados.slice(0, 3);
  }

  // Adicione este helper que faltava no inicio.page.ts
  possuiCaracteristica(usuario: UsuarioModel, nome: string): boolean {
    return usuario.caracteristicas?.some(
      (c) => c.nome.toUpperCase() === nome.toUpperCase(),
    ) ?? false;
  }

  abrirProfissional(profissional: any) {
    console.log(profissional);
    // futuramente:
    // this.router.navigate(['/view', profissional.id]);
  }

  filtrarCategoria(categoria: string) {
    console.log('Categoria:', categoria);
  }

  buscarProfissionaisLibras() {
    this.router.navigate(['/tabs/busca']);
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