export class CompromissoModel {
  id: string;
  idPedido: string;
  nomeServico: string;
  nomeCliente: string;
  data: string;
  horaInicio: string;
  horaFim: string;

  constructor() {
    this.id = '';
    this.idPedido = '';
    this.nomeServico = '';
    this.nomeCliente = '';
    this.data = '';
    this.horaInicio = '';
    this.horaFim = '';
  }
}