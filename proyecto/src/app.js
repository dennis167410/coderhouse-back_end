const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const {Server} = require('socket.io');
const productsRoutes = require('./routes/products.routes');
const carsRoutes = require('./routes/carritos.routes');
const pruebaRoutes = require('./routes/prueba.routes');
const cartsRouters = require('./routes/carts.routes.js');

//const messagesRoutes = require('./routes/messages.routes.js');

//const configureSocket = require('./routes/products.routes.js');
const websocket = require('./websocket.js');
const mongoose = require('mongoose');
const displayRoutes = require('express-routemap');

const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log('Servidor corriendo')
}
);
const io = new Server(httpServer);


const API_PREFIX = "api";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

// Creo conexión con mongoDB:
/*const DB_HOST = "localhost";
const DB_PORT = 27017;
const DB_NAME = "coder_proyecto2024";
*/

const DB_NAME = "ecommerce";

const connection = mongoose.connect(
    `mongodb+srv://dennismrodriguezc:ojosbonitos1982@cluster0.x29xjxm.mongodb.net/${DB_NAME}`
   // `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
).then((conn) => {
    //console.log("Conectado a MondoDB... ", conn);
    console.log("Conectado a MondoDB... ");
}).catch((error) => {
   // console.log("Error de conexión... ", error);
    console.log("Error de conexión... ");
})



////////////////////////////

// WebSocket:
 app.get('/realtimeproducts', async(req, res) => {
    res.render('realTimeProducts')   
})

app.use(`/${API_PREFIX}/messages`, async(req, res) => {
    res.render('chat')   
});

////////////////////////////////////////////////////

websocket(io);

///////////////////////////////////////

app.use(`/${API_PREFIX}/prueba`, pruebaRoutes);
app.use(`/${API_PREFIX}/cartsv2`, cartsRouters);

// PRODUCTS ROUTES: /api/products
app.use(`/${API_PREFIX}/products`, productsRoutes);

// Carrito ROUTES: /api/cars
app.use(`/${API_PREFIX}/carts`, carsRoutes);

/*
app.listen(PORT, () => {
    console.log('Servidor corriendo')
})*/