import express from "express";
import Fachada from "../control/Fachada";
import Usuario from "../model/entidade/usuario";

export const UsuarioRouter = express.Router();

let fachada = new Fachada();

UsuarioRouter.post("/", async (req, res) => {
  const usuario = {
    nome: req.body.nome,
    dataNasc: req.body.data_nasc,
    cpf: req.body.cpf,
    telefone: req.body.telefone,
    sexo: req.body.sexo,
    email: req.body.email,
    senha: req.body.senha,
  };

  let conversao = Object.assign(new Usuario(), usuario);
  let user = await fachada.cadastrar(conversao);

  if (user.msgn.length > 1) {
    res.status(400).json({ status: 1, mensagem: user.msgn });
  }
  else {
    res.status(200).json({ status: 0, dados: user });
  }

});

UsuarioRouter.get("/", async (req, res) => {
  let listaUsuarios: Array<Usuario> = (await fachada.consultar(
    new Usuario()
  )) as Array<Usuario>;
  if (listaUsuarios.length > 0) {
    res.status(200).json({ message: "OK", dados: listaUsuarios });
  }
  else
    res.status(400).json({ message: "Sem dados cadastrados" });
});

UsuarioRouter.get("/:id", async (req, res) => {
  const usuario = {
    id: req.params.id
  }
  let conversao = Object.assign(new Usuario(), usuario);
  let listaUsuarios: any = (await fachada.consultarId(conversao))

  listaUsuarios = listaUsuarios as Usuario;

  if (listaUsuarios.length > 0) {
    res.status(200).json({ message: "OK", dados: listaUsuarios, eventos: listaUsuarios.eventos });
  }
  else
    res.status(400).json({ message: "Sem dados cadastrados" });
});


UsuarioRouter.post("/login", async (req, res) => {
  const usuario = {
    email: req.body.email,
    senha: req.body.senha,
  };

  let conversao = Object.assign(new Usuario(), usuario);
  let listaUsuario: any = await fachada.consultarLogin(conversao as Usuario);
  listaUsuario = listaUsuario as Usuario;



  if (listaUsuario.msgn != null) {
    res.status(400).json({ status: 1, mensagem: listaUsuario });
  }
  else {
    res.status(200).json({ message: "OK", dados: listaUsuario, eventos: listaUsuario.eventos });
  }
});