/*const express = require('express');
const handlebars = require('express-handlebars'); */

import express from 'express';
import handlebars from 'express-handlebars';
import __dirname from './utils.js';
import path from 'path';

const app = express();
const PORT = 3000;

//console.log("dirname = " + __dirname)

app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(__dirname, '../views'));
app.set("view engine", "handlebars");

//app.use('/static', express.static(__dirname + '/public'));
app.use(express.static(path.join(__dirname, '../public')));

/*app.get("/", (req, res) =>{
    res.render('index')
})*/

app.listen(PORT, ()=> console.log(`Escuchando en el puerto ${PORT}`));
