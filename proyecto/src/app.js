const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const {Server} = require('socket.io');
const mongoose = require('mongoose');
const displayRoutes = require('express-routemap');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require("connect-mongo");
const passport = require("passport");
const { rejects } = require('assert');

//RUTAS
const productosRoutes = require('./routing/productos.routes');
const carritoRoutes = require('./routing/carritos.routes');
const productsRoutes = require('./routing/products.routes.js');
const cartsRouters = require('./routing/carts.routes.js');
const viewRoutes = require('./routing/view.routes.js');
const cookiesRoutes = require('./routing/cookies.routes');
const sessionRoutes = require("./routing/session.routes");
const usersRoutes = require('./routing/user.routes.js');

//ARCHIVOS DE CONFIGURACIÓN
const websocket = require('./websocket.js');
const authMdw = require('./middleware/auth.middleware.js');
const initializePassport = require("./config/passport.config.js");
const config = require("./config/config.js");

const PORT = Number(config.PORT) || 8082;

const app = express();
const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log('Servidor corriendo')
}
);

const io = new Server(httpServer);

const API_PREFIX = config.API_PREFIX;
const COOKIE_SIGN = config.COOKIE_SIGN;
const SECRET_SESSION = config.SECRET_SESSION;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, '/public')));

//Configuración cookie parser:
app.use(cookieParser(COOKIE_SIGN));

console.log(config)
const DB_NAME = config.DB_NAME;
const MONGO_URL =  `${config.MONGO_URL}/${DB_NAME}`

console.log(MONGO_URL)
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL,
            mongoOptions: {useNewUrlParser:true, useUnifiedTopology:true},
            ttl:60*3600 // Tiempo de vida de la sesion.
        }),
        secret: SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
    })
    );

// Para ejecutar passport
initializePassport();
app.use(passport.initialize());
//app.use(passport.session());

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");


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

mongoose
.connect(MONGO_URL)
.then((conn) =>{
    console.log("CONECTADO A MONGO")
})
.catch((err) =>{
    console.log("Error al intentar conectarse a mongo.")
})


app.use(`/api/views`, viewRoutes);
app.use(`/api/cookies`, cookiesRoutes);
app.use(`/api/session`, sessionRoutes); // Inicio de ruta pública.

app.use("/api/private/",authMdw, (req, res) => {
    const username = req.session.user;
    return res.json({
        message: `Ruta protegida, tu eres el usuario ${username}`, 
    });
    });

app.use(`/${API_PREFIX}/products`, productsRoutes);
app.use(`/`, viewRoutes);
//app.use(`/${API_PREFIX}/views`, viewRoutes);

app.use(`/${API_PREFIX}/carts`, cartsRouters);
app.use(`/${API_PREFIX}/user`, usersRoutes);

////////////////////////////////////////////////////

// FileSystem:
// PRODUCTS ROUTES: /api/products
//app.use(`/${API_PREFIX}/productos`, productosRoutes);
// Carrito ROUTES: /api/cars
//app.use(`/${API_PREFIX}/carrito`, carritoRoutes);

/*
app.listen(PORT, () => {
    console.log('Servidor corriendo')
})*/