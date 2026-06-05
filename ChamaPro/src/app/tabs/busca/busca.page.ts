import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { RouterModule, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  searchOutline,
  handLeftOutline,
  star
} from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ServicoService } from 'src/app/services/servico.service';
import { ProfissionalServicoService } from 'src/app/services/profissional-servico.service';

import { UsuarioModel } from 'src/app/model/usuario.model';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, CommonModule, FormsModule]
})
export class BuscaPage implements OnInit {
  textoBusca = '';
  filtroSelecionado = 'todos';
  resultados: any[] = [];
  resultadosFiltrados: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private servicoService: ServicoService,
    private profissionalServicoService: ProfissionalServicoService,
    private router: Router
  ) {

    addIcons({
      searchOutline,
      handLeftOutline,
      star
    });

  }

  ngOnInit(): void {
    const profissionalServicos = this.profissionalServicoService.listar();
    this.resultados = [];
    profissionalServicos.forEach(ps => {
      const profissional = this.usuarioService.buscarPorId(ps.idProfissional);
      const servico =this.servicoService.buscarPorId(ps.idServico);
      if (profissional.id && servico.id) {
        this.resultados.push({ ps, profissional, servico});
      }
      console.log("Profissional: ", profissional);
    });
    this.resultadosFiltrados = [...this.resultados];
  }


  selecionarFiltro(filtro: string) {
    this.filtroSelecionado = filtro;
    this.filtrarResultados();
  }

  filtrarResultados() {
    let lista = [...this.resultados];
    const termo = this.textoBusca.trim().toLowerCase();
    if (termo) {
      lista = lista.filter(item =>
        item.profissional.nome.toLowerCase().includes(termo)
        ||
        item.servico.nome.toLowerCase().includes(termo)
        ||
        item.servico.descricao.toLowerCase().includes(termo)
      );
    }

    switch (this.filtroSelecionado) {
      case 'libras':
        lista = lista.filter(item =>
          this.possuiCaracteristica(item.profissional,'LIBRAS')
        );
        break;
      case 'verificado':
        lista = lista.filter(item =>
          this.possuiCaracteristica(item.profissional,'VERIFICADO')
        );
        break;
      case 'avaliacao':
        lista.sort(
          (a, b) =>
            b.profissional.nota -
            a.profissional.nota
        );
        break;
    }
    this.resultadosFiltrados = lista;
  }

  possuiCaracteristica(usuario: UsuarioModel,nome: string): boolean {
    return usuario.caracteristicas.some(c =>
        c.nome.toUpperCase() === nome.toUpperCase()
    );
  }

  obterIniciais(nome: string): string {
    return nome.split(' ').slice(0, 2).map(x => x[0]).join('').toUpperCase();
  }

  calcularAnos(data: Date): number {
    const inicio = new Date(data);
    const hoje = new Date();
    return hoje.getFullYear() - inicio.getFullYear();
  }

  abrirProfissional(item: any) {
    console.log(item);
    // Exemplo futuro:
    // this.router.navigate([
    //   '/tabs/profissional',
    //   item.profissional.id
    // ]);

  }

}
