const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const {Server} = require('socket.io');
const productsRoutes = require('./routes/products.routes');
const carsRoutes = require('./routes/carritos.routes');
const configureSocket = require('./routes/products.routes.js');

const PORT = 8080;
const app = express();
const httpServer = app.listen(PORT, () => console.log('Servidor corriendo'));
const io = new Server(httpServer);


const API_PREFIX = "api";

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

////////////////////////////

// WebSocket:
 app.get('/realtimeproducts', async(req, res) => {
    res.render('realTimeProducts')   
})


io.on("connection", async (socket) => {
    console.log('Nuevo cliente conectado: ', socket.id);

    const ProductManager = require("./entidad/ProductManager.js");
    const entregable = new ProductManager();
    let respuesta = await entregable.getProducts();

    socket.emit('todos',respuesta.productos)

    io.emit('tProducts', respuesta.productos)

    socket.on('eliminar_producto', (data) => {
        let resp =  entregable.deleteProduct(Number(data));
        console.log(resp);
    })

    socket.on('crear_producto', (p) =>{
        let resp =  entregable.addProduct(p);
    }) 
})


///////////////////////////////////////

// PRODUCTS ROUTES: /api/products
app.use(`/${API_PREFIX}/products`, productsRoutes);
//app.use('/realtimeproducts', productsRoutes);

// Carrito ROUTES: /api/cars
app.use(`/${API_PREFIX}/carts`, carsRoutes);

/*
app.listen(PORT, () => {
    console.log('Servidor corriendo')
})*/