export class CaracteristicaUsuarioModel {
  id: string;
  idUsuario: string;
  idCaracteristica: string;
  caracteristicaNome: string;
  // "tem": o usuário possui/se identifica com essa característica.
  // "lida": o usuário (profissional) sabe atender clientes com essa característica.
  tem: boolean;
  lida: boolean;

  constructor() {
    this.id = '';
    this.idUsuario = '';
    this.idCaracteristica = '';
    this.caracteristicaNome = '';
    this.tem = false;
    this.lida = false;
  }
}
