
import EntidadeDominio from "../entidade/entidadeDominio";
import Usuario from "../entidade/usuario";
import IStrategy from "./IStrategy";


export default class ValidarDadosObrigatorios implements IStrategy {
    async processar(entidade: EntidadeDominio): Promise<string> {
        const usuario = entidade as Usuario;      
        
        let nome = usuario.nome;
        let dataNasc = usuario.dataNasc;
        let cpf = usuario.cpf;
        let telefone = usuario.telefone;
        let sexo = usuario.sexo;
        let email = usuario.email;
        let senha = usuario.senha;

        if (nome == "" ||
            dataNasc == null ||
            cpf == "" ||
            telefone == "" ||
            email == "" ||
            senha == "" ||
            sexo == null) {
                return "Todos os dados são obrigatorios! ";               
                        
        }
        
        return null!

    }

}