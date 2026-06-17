import { UsuarioModel } from "./usuario.model";

export class AvaliacaoModel {
    id: string;
    valor: number;
    usuario!: UsuarioModel;
    descricao: string;

    constructor(){
        this.id = "";
        this.valor = 0;
        this.descricao = "";
    }
}
