import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import {Server} from 'socket.io';
//import mongoose from 'mongoose';
import displayRoutes from 'express-routemap';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mongoStore from "connect-mongo";
import passport from "passport";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

//RUTAS
import productsRoutes from './routing/products.routes.js';
import cartsRouters from './routing/carts.routes.js';
import viewRoutes from './routing/view.routes.js';
import cookiesRoutes from './routing/cookies.routes.js';
import sessionRoutes from "./routing/session.routes.js";
import usersRoutes from './routing/user.routes.js';
import mocksRoutes from './routing/mocks.routes.js';
import { swaggerOptions } from "./config/swagger.config.js";

//Solo con la finalidad de test:
//import ticketsRoutes from './routing/tickets.routes.js';

//ARCHIVOS DE CONFIGURACIÓN
import websocket from  './websocket.js';
import authMdw from './middleware/auth.middleware.js';
import initializePassport from "./config/passport.config.js";
import {PERSISTENCE, PORT, DB_NAME, MONGO_URL, API_PREFIX, COOKIE_SIGN, SECRET_SESSION} from "./config/config.js";
import handlePolicies from './middleware/handle-policies.middleware.js';
import { useLogger } from './utils/logger.js';

import setupCronJobs from './utils/cronjob.js';


import emailRoutes from "./routing/email.routes.js";

const PORT_APP = Number(PORT) || 8082;
const app = express();

app.use(useLogger);

app.get('/loggerTest', (req, res) =>{
   req.logger.fatal(`Petición fatal`);
   req.logger.error(`Petición error`);
   req.logger.warning('Petición warning');
   req.logger.info('Petición info');
   req.logger.http('Petición http');
   req.logger.debug('Petición debug');
    
    res.send({message: "Test de todos los logger"})
})


const httpServer = app.listen(PORT_APP, () => {
    displayRoutes(app);
    console.log('Servidor corriendo')
    console.log(`PERSISTENCE: ${PERSISTENCE}`)
}
);

const io = new Server(httpServer);

const API_PREFIX_APP = API_PREFIX;
const COOKIE_SIGN_APP = COOKIE_SIGN;
const SECRET_SESSION_APP = SECRET_SESSION;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static(path.join(__dirname, '/public')));

//Configuración cookie parser:
app.use(cookieParser(COOKIE_SIGN_APP));

const DB_NAME_APP = DB_NAME;
const MONGO_URL_APP =  `${MONGO_URL}/${DB_NAME_APP}`
app.use(
    session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL_APP,
           // mongoOptions: {useNewUrlParser:true, useUnifiedTopology:true},
            ttl:60*3600 // Tiempo de vida de la sesion.
        }),
        secret: SECRET_SESSION_APP,
        resave: false,
        saveUninitialized: false,
    })
    );

// Para ejecutar passport
initializePassport();
app.use(passport.initialize());
//app.use(passport.session());

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
app.use(express.static(path.join(__dirname, '/public')));

//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
//app.set('views', path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

handlebars.create({
    helpers: {
        ifArray: function (value, options) {
            if (Array.isArray(value)) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        }
    }
});

////////////////////////////

// Cron job
setupCronJobs();

// Test envío de mail:
app.use('/mail', emailRoutes);

///////////////////////

// WebSocket:
 app.get('/realtimeproducts', async(req, res) => {
    res.render('realTimeProducts')   
})

app.use(`/${API_PREFIX}/messages`, handlePolicies(["USER"]), async(req, res) => {
    res.render('chat')   
});

////////////////////////////////////////////////////

websocket(io);

///////////////////////////////////////
// swagger
const specs = swaggerJSDoc(swaggerOptions)

///////////////////////////////////////

app.use(`/api/views`, viewRoutes);
app.use(`/api/cookies`, cookiesRoutes);
app.use(`/api/session`, sessionRoutes); // Inicio de ruta pública.

app.use("/api/private/",authMdw, (req, res) => {
    const username = req.session.user;
    return res.json({
        message: `Ruta protegida, tu eres el usuario ${username}`, 
    });
    });

app.use(`/${API_PREFIX_APP}/products`, productsRoutes);
app.use(`/`, viewRoutes);

app.use(`/${API_PREFIX_APP}/carts`, cartsRouters);
app.use(`/${API_PREFIX_APP}/users`, usersRoutes);

app.use('/mockingproducts', mocksRoutes);

app.use('/api/docs/', swaggerUi.serve, swaggerUi.setup(specs));

//Solo para test:
//app.use(`/${API_PREFIX_APP}/tickets`, ticketsRoutes);
