import EntidadeDominio from "./entidadeDominio";
import Evento from "./evento";

export default class Usuario extends EntidadeDominio {
    nome!: string;
    dataNasc!: Date;
    cpf!: string;
    tipoTelefone!: string;
    telefone!: string;
    sexo!: string;
    email!: string;
    senha!: string;
    eventos!: Array<Evento>;    
}