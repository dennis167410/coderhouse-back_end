const express = require('express');
const productsRoutes = require('./routes/products.routes');
const carsRoutes = require('./routes/carritos.routes');

const PORT = 8080;
const app = express();
const API_PREFIX = "api";

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// PRODUCTS ROUTES: /api/products
app.use(`/${API_PREFIX}/products`, productsRoutes);

// Carrito ROUTES: /api/cars
app.use(`/${API_PREFIX}/carts`, carsRoutes);

app.listen(PORT, () => {
    console.log('Servidor corriendo')
})