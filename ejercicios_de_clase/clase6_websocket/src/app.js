//const express = require('express');
//const handlebars = require('express-handlebars'); 

import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const PORT = 3000;

//console.log("dirname = " + __dirname)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const httpServer = app.listen(PORT, ()=> console.log(`Escuchando en el puerto ${PORT}`));

const io = new Server(httpServer);

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set("view engine", "handlebars");

//app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '../public')));

app.get("/", (req, res) =>{
    res.render('index')
})

//const mensajes = [];

const todosLosMensajes = [];

// INICIAMOS LA CONEXIÓN POR PARTE DEL SERVIDOR. 
io.on('connection', (socket) =>{
  //  console.log('Nuevo cliente conectado: ', socket.id);

    socket.emit('msg-logs', todosLosMensajes);

    socket.on('new-msg', (data) =>{
       // {socketid: 'id', message: 'mensaje-cliente'}
       const msg = {socketid: socket.id, message: data};
       console.log(msg)
       todosLosMensajes.push(msg);
       io.emit('msg-logs', todosLosMensajes);
    });

    /*socket.on('char', (data) =>{
        if(data === 'Backspace') mensajes.pop();
        else 
        mensajes.push(data);
        io.emit('msg', mensajes.join(''));
    })*/
})
/*io.on("connection", (socket) => {
    console.log('Nuevo cliente conectado: ', socket.id);

    // socket.on() escuchamos un evento.
    socket.on('nuevo-mensaje', (data) => {
        console.log(`Nuevo mensaje desde el cliente: \n >${data}`)
    });

    // Emitimos un mensaje. Evento para un socket individual. 
    socket.emit('nuevo-mensaje', "Hola, este mensaje solo lo debe recibir el socket.");

    socket.broadcast.emit('mensaje_para_todos_menos_al_socket_actual', "Este mensaje lo verán todos menos el socket actual.");

    io.emit('evento-para-todos', "Este mensaje lo veran todos los sockets");

});
*/

