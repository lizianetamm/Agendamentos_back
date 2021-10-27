import Fachada from "../../control/Fachada";
import EntidadeDominio from "../entidade/entidadeDominio";
import Usuario from "../entidade/usuario";
import IStrategy from "./IStrategy";

export default class ValidarExistencia implements IStrategy {
    async processar(entidade: EntidadeDominio, altera: boolean): Promise<string> {    
        const usuario = entidade as Usuario;          
        let fachada = new Fachada();
        let msgn = "";
        
        let usuarioCpf = await fachada.consultar(usuario)
        
        usuarioCpf.forEach(user => {
            let conversao = Object.assign(new Usuario(), user);                                
            if (usuario.cpf == conversao.cpf && !altera)
            msgn= "Usuario já cadastrado";            
        });
        if (msgn == "")
        return null!

        return msgn   
}   
}
                
                       
    
        
    
    
