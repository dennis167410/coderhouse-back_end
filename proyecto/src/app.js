const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const {Server} = require('socket.io');
const productsRoutes = require('./routes/products.routes');
const carsRoutes = require('./routes/carritos.routes');


const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => console.log('Servidor corriendo'));
const io = new Server(httpServer);

const API_PREFIX = "api";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

//console.log(__dirname + '/public')

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");


// views handlebars engine:
/*app.get('/saludar', (req, res) => {
    res.render('index')
})*/

////////////////////////////

// WebSocket:
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts')
})

io.on("connection", (socket) => {
    console.log('Nuevo cliente conectado: ', socket.id);
})

///////////////////////////////////////

// PRODUCTS ROUTES: /api/products
app.use(`/${API_PREFIX}/products`, productsRoutes);

// Carrito ROUTES: /api/cars
app.use(`/${API_PREFIX}/carts`, carsRoutes);

/*
app.listen(PORT, () => {
    console.log('Servidor corriendo')
})*/