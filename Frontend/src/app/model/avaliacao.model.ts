export class AvaliacaoModel {
    id: string;
    autorId: string;
    alvoId: string;
    pedidoId: string;
    nota: number;
    data: Date;
    descricao: string;

    constructor(){
        this.id = "";
        this.autorId = "";
        this.alvoId = "";
        this.pedidoId = "";
        this.nota = 0;
        this.data = new Date();
        this.descricao = "";
    }
}
