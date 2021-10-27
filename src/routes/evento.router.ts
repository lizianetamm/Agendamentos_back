import express from "express";
import Fachada from "../control/Fachada";
import Evento from "../model/entidade/evento";
import moment from "moment";
import { isForInStatement } from "typescript";

export const EventoRouter = express.Router();

let fachada = new Fachada();


EventoRouter.post("/:id", async (req, res) => {
    const evento = {
        idUsuario: req.params.id,
        descricao: req.body.descricao,
        nome: req.body.nome,
        first: req.body.first,
        second: req.body.second
    };

    let conversao = Object.assign(new Evento(), evento);
    let event = await fachada.cadastrar(conversao);

    res.status(200).json({ status: 0, dados: event });

});
EventoRouter.get("/", async (req, res) => {
    let listaEventos: Array<Evento> = (await fachada.consultar(
        new Evento()
    )) as Array<Evento>;
    if (listaEventos.length > 0) {
        res.status(200).json({ message: "OK", dados: listaEventos });
    }
    else
        res.status(400).json({ message: "Sem dados cadastrados" });
});

EventoRouter.put("/:id", async (req, res) => {
    const evento = {
        id: req.params.id,
        descricao: req.body.descricao,
        // horaInicio: req.body.horaInicio,
        // horaTermino: req.body.horaTermino,
        nome: req.body.nome,
        first: req.body.first,
        second: req.body.second

    };

    let conversao = Object.assign(new Evento(), evento);
    let event = await fachada.alterar(conversao);
    
    res.status(200).json({ status: 0, dados: event });
   

});
EventoRouter.delete("/:id", async (req, res) => {
    const evento = {
        id: req.params.id,
    };
    let conversao = Object.assign(new Evento(), evento);
    let event: boolean = await fachada.excluir(conversao as Evento);

    if (event) {
        res.status(200).json({ status: 0, });
    }
    else {
        res.status(400).json({ status: 1 });
    }

});


