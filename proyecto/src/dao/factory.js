import mongoose from "mongoose";
import session from 'express-session';
import mongoStore from "connect-mongo";

import {PERSISTENCE, PORT, DB_NAME, MONGO_URL} from "../config/config.js";

export let Products;
export let Carts;
export let Users;
export let Tickets;

const DB_NAME_APP = DB_NAME;
const MONGO_URL_APP =  `${MONGO_URL}/${DB_NAME_APP}`

//console.log(MONGO_URL_APP)

switch(PERSISTENCE){
    case "MONGO":

    const DB_NAME_APP = DB_NAME;
    const MONGO_URL_APP =  `${MONGO_URL}/${DB_NAME_APP}`
  
        mongoose
            .connect(MONGO_URL_APP)
            .then((conn) =>{
                console.log("CONECTADO A MONGO")
             })
            .catch((err) =>{
                console.log("Error al intentar conectarse a mongo... ", err)
            });
}

const {default: ProductManager} = await import ('../dao/managers/ProductManager.js');
const {default: CartManager} = await import ('../dao/managers/CartManager.js');

const {default: UserManager} = await import ('../dao/managers/UserManager.js');
const {default: TicketManager} = await import ('../dao/managers/TicketManager.js');

Products = ProductManager;
Carts = CartManager;
Users = UserManager;
Tickets = TicketManager;