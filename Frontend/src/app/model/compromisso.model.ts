export class CompromissoModel {
  id: string;
  idPedido: string;
  nomeServico: string;
  nomeCliente: string;
  endereco: string;
  descricao: string;
  preco: number;
  data: string;
  horaInicio: string;
  horaFim: string;

  constructor() {
    this.id = '';
    this.idPedido = '';
    this.nomeServico = '';
    this.nomeCliente = '';
    this.endereco = '';
    this.descricao = '';
    this.preco = 0;
    this.data = '';
    this.horaInicio = '';
    this.horaFim = '';
  }
}