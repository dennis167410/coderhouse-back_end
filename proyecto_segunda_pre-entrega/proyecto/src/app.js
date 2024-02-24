const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const {Server} = require('socket.io');
const productosRoutes = require('./routes/productos.routes');
const carritoRoutes = require('./routes/carritos.routes');
const productsRoutes = require('./routes/products.routes.js');
const cartsRouters = require('./routes/carts.routes.js');

const websocket = require('./websocket.js');
const mongoose = require('mongoose');
const displayRoutes = require('express-routemap');
const viewRoutes = require('./routes/view.routes.js');

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
     console.log("Conectado a MondoDB... ");
}).catch((error) => {
  
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

//MongoDB
app.use(`/${API_PREFIX}/products`, productsRoutes);
app.use(`/${API_PREFIX}/views`, viewRoutes);


app.use(`/${API_PREFIX}/carts`, cartsRouters);

////////////////////////////////////////////////////

// FileSystem:
// PRODUCTS ROUTES: /api/products
app.use(`/${API_PREFIX}/productos`, productosRoutes);
// Carrito ROUTES: /api/cars
app.use(`/${API_PREFIX}/carrrito`, carritoRoutes);

/*
app.listen(PORT, () => {
    console.log('Servidor corriendo')
})*/