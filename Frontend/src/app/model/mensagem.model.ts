export class MensagemModel {
    id: string;
    idPedido: string;
    idRemetente: string;
    nomeRemetente: string;
    texto: string;
    data: Date;
    lida: boolean;

    constructor() {
        this.id = "";
        this.idPedido = "";
        this.idRemetente = "";
        this.nomeRemetente = "";
        this.texto = "";
        this.data = new Date();
        this.lida = false;
    }
}
