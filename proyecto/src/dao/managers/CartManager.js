import cartModel from '../model/cart.model.js';
import ticketModel from '../model/ticket.model.js';
import ProductManager from './ProductManager.js';
import TicketManager from './TicketManager.js';
import UserManager from './UserManager.js';

const productManager = new ProductManager();
const ticketManager = new TicketManager();
const userManager = new UserManager();

class CartManager {
    constructor(dao){
        this.dao = dao; 
    }

    finalizePurchase = async (myCart) => {
        try{
            let cart = await cartModel.findById(myCart);
            const purchaser = await userManager.getUserEmailByCartId(myCart);
                       
            const amount = await this.totalAmount(cart.products);
            const t = await ticketManager.addTicket(amount,purchaser);
            
            return t; 
        }catch(error){

        }
    }

    totalAmount = async (products) => {
        let totalAmount = 0;
        for (const item of products) {
            const product = await productManager.getProductById(item.product);
            if (product) {
                 totalAmount += item.quantity * product[0].price;
            } else {
                console.error(`Producto no encontrado.`);
            }
        }
        return totalAmount;
    }

    addCarts1 = async (cartsData) => {
        try{
            let newCart = await cartModel.create({cartsData});
            return newCart;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    addCart2 = async (cartsData) => {
        try{
            const {cartId, products} = cartsData;
            const productId = products[0].id;
            const quantity = products[0].quantity;
        
            let cart = await cartModel.findOne({_id: cartId});
            const r = await this.elProductoTieneStock(productId, quantity);
            if(r){
            const ret = await productManager.discountStock(productId, quantity);
            cart.products.push({ product: productId, quantity });
            const re = await cart.save();
              return r;
            }else{
                return "Sin stock"
            }
        }catch(error){
            console.log("Error: ", error);
        }
    }

    
 tieneStock= async (products) => {
    
    let pDisponibles = [];
    for (const unP of products) {
        const product = await productManager.getProductById(unP.id);
        if (product.length === 0 || product.every(p => p.stock >= unP.quantity)) {
            const product2 = await productManager.discountStock(unP.id, unP.quantity);
            pDisponibles.push({ productId: unP.id, quantity: unP.quantity });
          }
        }

        return pDisponibles;
    }

    // Crea el carrito con productos pasados por el body:
    /*{
        "products": [
            {
                "id": "65d0331cd7671692a60e8136",
                "quantity": 1
            },
            {
                "id": "65d0d850b03d37dd4d779c03",
                "quantity": 2
            }
        ]
    }
    */
    
    addCart3 = async (cartData) => {
        try {
           const {products} = cartData;
          
           let pDisponibles = [];
    
            pDisponibles = await this.tieneStock(products);
        
            let noDisponibles = []
           
            for(let i = 0; i < products.length; i++){
                let existe = false;
                for(let j = 0; j < pDisponibles.length; j++){
                    if (products[i].id === pDisponibles[j].productId) {
                        existe = true;
                        break;
                    }
                }
                if (!existe) {
                    noDisponibles.push(products[i].id);
                }
            }
        
           if (pDisponibles.length > 0) {
            let newCart = await cartModel.create({});
            
            pDisponibles.forEach(unP=>{
                newCart.products.push({product: unP.productId, quantity: unP.quantity})

            });

            const r = await cartModel.updateOne({_id:newCart._id}, newCart)
            return noDisponibles; 
        }else{
            return noDisponibles;
        }
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            
        }
    };
    

/////////////////////////////////////////////////////////////

    getAllCarts = async () => {
        try{
            const carts = await cartModel.find().populate('products.product');
            return carts;
        }catch(error){
            console.log("Error: ", error);
        }
    }

/////////////////////////////////////////////////////////////
   
    getCartById = async (unCid) => {
        try{
            const cart = await cartModel.findOne({_id: unCid}).populate('products.product');
            return cart;
        }catch(error){
            console.log("Error: ", error);
        }
    
    }

/////////////////////////////////////////////////////////////

elProductoTieneStock= async (pId, quantity) => {
    let retorno = false;
        console.log(pId, " ", quantity)
            const p = await productManager.getProductById(pId);
            console.log(p[0].stock)
        if (p[0].stock >= quantity) {
            //const product2 = await productManager.discountStock(unP.id, unP.quantity);
            retorno = true;
          }
        return retorno;
    }  


  updateCart = async (cId, unPid, quantity)=> {

        try{
       const cart = await cartModel.findOne({ _id: cId });
        
        if(!cart){
            cart = new cartModel({
                _id: cId,
                products: [{ product: unPid, quantity }]
            });
        }else{
         
          const existeElProduct = cart.products.find(item => item.product.toString() === unPid);
            if (existeElProduct) {
                const r = await this.elProductoTieneStock(unPid, quantity);
                if(r){
                      const ret = await productManager.discountStock(unPid, quantity);
                // Si el producto está en el carrito, suma la cantidad.
                await cartModel.findOneAndUpdate(
                    {_id: cId, "products.product": unPid},
                    { $inc: {"products.$.quantity": quantity}}
                );

                return await cartModel.findById(cId)//res.json({ok: true, Carrito: respuesta});
   
                }else{
                    return "Sin stock"
                }
            } else {
             const r = await this.elProductoTieneStock(unPid, quantity);
             if(r){
                const ret = await productManager.discountStock(unPid, quantity);
               
                // Si el producto no está en el carrito, lo agrega.
               
               await cartModel.findOneAndUpdate(
                    {_id: cId},
                    {$push: {products: {product: unPid, quantity}}}
                )
                return await cartModel.findById(cId)

            }else{
                return "Sin stock"
            } 
            }
        }

}catch(error){
console.log(error)
}

    }
/////////////////////////////////////////////////////////////

deleteProductByCart = async (cId, unPid)=> {
    await cartModel.updateOne(
        { _id: cId },
        { $pull: { products: {product: unPid } } },
        
      );
}


deleteAllProductByCartId = async (cId)=> {
    await cartModel.updateOne(
        { _id: cId },
        { $set: { products: [] } }
      );
}

}

export default CartManager;