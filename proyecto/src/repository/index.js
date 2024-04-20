import {Products, Carts, Users, Tickets} from "../dao/factory.js";

import ProductRepository from "../dao/managers/ProductManager.js";
import CartRepository from "../dao/managers/CartManager.js";
import UserRepository from "../dao/managers/UserManager.js";

// SOLO PARA TEST
import TicketRepository from "../dao/managers/TicketManager.js";

export const ProductService = new ProductRepository(new Products());
export const CartService = new CartRepository(new Carts());
export const UserService = new UserRepository(new Users());

// SOLO PARA TEST
export const TicketService = new TicketRepository(new Tickets());
