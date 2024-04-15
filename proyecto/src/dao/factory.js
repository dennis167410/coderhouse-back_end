import mongoose from "mongoose";
import session from 'express-session';
import mongoStore from "connect-mongo";

import {PERSISTENCE, PORT, DB_NAME, MONGO_URL} from "../config/config.js";

export let Products;
export let Carts;
//export let Tickets;

const DB_NAME_APP = DB_NAME;
const MONGO_URL_APP =  `${MONGO_URL}/${DB_NAME_APP}`

console.log(MONGO_URL_APP)

switch(PERSISTENCE){
    case "MONGO":

    const DB_NAME_APP = DB_NAME;
    const MONGO_URL_APP =  `${MONGO_URL}/${DB_NAME_APP}`
    //console.log("ACA", MONGO_URL_APP)
   /*app.use(
        session({
        store: mongoStore.create({
            mongoUrl: MONGO_URL_APP,//MONGO_URL,
           // mongoOptions: {useNewUrlParser:true, useUnifiedTopology:true},
            ttl:60*3600 // Tiempo de vida de la sesion.
        }),
        secret: SECRET_SESSION_APP,//SECRET_SESSION,
        resave: false,
        saveUninitialized: false,
    })
    );*/
        mongoose
            .connect(MONGO_URL_APP)
            .then((conn) =>{
                console.log("CONECTADO A MONGO")
             })
            .catch((err) =>{
                console.log("Error al intentar conectarse a mongo... ", err)
            });
}

//No queda claro esto:
const {default: ProductManager} = await import ('../dao/managers/ProductManager.js');
const {default: CartManager} = await import ('../dao/managers/CartManager.js');
//const {default: OrderManager} = await import ('../dao/managers/OrderManager.js');

Products = ProductManager;
Carts = CartManager;
