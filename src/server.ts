import express from 'express';
import { EventoRouter } from './routes/evento.router';
import { UsuarioRouter } from './routes/usuario.route';


const cors = require('cors');

const app = express();
const port = 3000;

app.use('/', express.urlencoded({extended: true}));
app.use('/', express.json());

app.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Credentials", "true")
    res.header("Access-Control-Allow-Headers", "content-type")
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH")
    app.use(cors())
    next();
})

app.use('/', express.urlencoded({extended: true}));
app.use('/', express.json());

app.use('/usuario', UsuarioRouter);
app.use('/evento', EventoRouter);


app.listen(port, () => {
    console.log(`Listening on: http://localhost:${port}`);
});