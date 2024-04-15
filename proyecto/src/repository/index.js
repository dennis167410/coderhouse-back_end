import {Products, Carts} from "../dao/factory.js";

//import ProductRepository from "./product.repository.js";
import ProductRepository from "../dao/managers/ProductManager.js";
import CartRepository from "../dao/managers/CartManager.js";

//import TicketRepository from "../dao/manager/TicketManager.js";


export const ProductService = new ProductRepository(new Products());
export const CartService = new CartRepository(new Carts());

//export const TicketService = new TicketRepository(new Ticket());
