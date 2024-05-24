import cartModel from '../model/cart.model.js';
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
            
            let pDisponibles = await this.tieneStock(cart.products);

            let noDisponibles = [];

            for(let i = 0; i < cart.products.length; i++){
                let existe = false;
                for(let j = 0; j < pDisponibles.length; j++){
                    if (cart.products[i].product === pDisponibles[j].productId) {
                        existe = true;
                        break;
                    }
                }
                if (!existe) {
                    noDisponibles.push(cart.products[i].product);
                }
            }

            const purchaser = await userManager.getUserEmailByCartId(myCart);
            
            if(purchaser){
            const amount = await this.totalAmount(pDisponibles);
            const t = await ticketManager.addTicket(amount,purchaser);           
            cart.products = cart.products.filter(product =>{
                return noDisponibles.includes(product.product);
            })
            await cart.save(); 
    
            return noDisponibles;
            }else{
                return 401;//"Error, deberá asociar el carrito al usuario."
            } 
        }catch(error){
            return null;
        }
    }

    totalAmount = async (products) => {
        let totalAmount = 0;
        for (const item of products) {
            const product = await productManager.getProductById(item.productId);
            if (product) {
                 totalAmount += item.quantity * product[0].price;
            } else {

            }
        }
        return totalAmount;
    }

    addCarts1 = async (cartsData) => {
        try{
            //let newCart = await cartModel.create({cartsData});
            let newCart = await cartModel.create({});
            return newCart;
        }catch(error){
            return null;
        }
    }

    addCart2 = async (cartsData, user, role) => {
        try{
            const {cartId, products} = cartsData;

            const productId = products[0].id;
            const quantity = products[0].quantity;
         
            let cart = null;
            try{
                cart = await cartModel.findOne({_id: cartId});
                
            }catch(error){
                return null;
            }

        const existeElProduct = cart.products.find(item => item.product.toString() === productId);

        if (existeElProduct) {
                 if (role === "PREMIUM" && user === existeElProduct[0].owner) {
                    return null;
                } 
                // Si el producto está en el carrito, suma la cantidad.
              return await cartModel.findOneAndUpdate(
                    {_id: cartId, "products.product": productId},
                    { $inc: {"products.$.quantity": quantity}}
                );

            } else {  
            // Verifica si es el que creo el producto.
            const product = await productManager.getProductById(productId);
                if (role === "PREMIUM" && user === product[0].owner) {
                  return null;
                }
                
                // Si el producto no está en el carrito, lo agrega.
                return await cartModel.findOneAndUpdate(
                    {_id: cartId},
                    {$push: {products: {product: productId, quantity}}}
                )
                
            }

        }catch(error){
            return null;
        }
    }

    
 tieneStock= async (products) => {
    let pDisponibles = [];
    for (const unP of products) {
        const product = await productManager.getProductById(unP.product);
        if (product.length === 0 || product.every(p => p.stock >= unP.quantity)) {
            const product2 = await productManager.discountStock(unP.product, unP.quantity);
            pDisponibles.push({ productId: unP.product, quantity: unP.quantity });
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
            let newCart = await cartModel.create({});
            const {products} = cartData;
            
            for (const unP of products) {
                const product = await productManager.getProductById(unP.id);
            

                if (product && product.length > 0 ){// product.every(p => p.stock >= unP.quantity)) {
                    newCart.products.push({product: unP.id, quantity: unP.quantity})
                    //const product2 = await productManager.discountStock(unP.product, unP.quantity);
                    //pDisponibles.push({ productId: unP.product, quantity: unP.quantity });
                  }
                }
        
           
                
            if(!newCart.products || newCart.products.length ==0){
               await cartModel.deleteOne({ _id: newCart._id });
               return null;
            }else{

            let r = await cartModel.updateOne({_id:newCart._id}, newCart)
            return r;
            }
        } catch (error) {
            return null;
            
        }
    };


/////////////////////////////////////////////////////////////

    getAllCarts = async () => {
        try{
            const carts = await cartModel.find().populate('products.product');
            return carts;
        }catch(error){
           return null;
        }
    }

/////////////////////////////////////////////////////////////
   
    getCartById = async (unCid) => {
        try{
            const cart = await cartModel.findOne({_id: unCid}).populate('products.product');
            return cart;
        }catch(error){
            return null;
        }
    
    }

/////////////////////////////////////////////////////////////

elProductoTieneStock= async (pId, quantity) => {
    let retorno = false;
            const p = await productManager.getProductById(pId);
        if (p[0].stock >= quantity) {
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
                // Si el producto está en el carrito, suma la cantidad.
                return await cartModel.findOneAndUpdate(
                    {_id: cId, "products.product": unPid},
                    { $inc: {"products.$.quantity": quantity}}
                );

            } else {
                // Si el producto no está en el carrito, lo agrega.
              return  await cartModel.findOneAndUpdate(
                    {_id: cId},
                    {$push: {products: {product: unPid, quantity}}}
                )
                
            }
        }

}catch(error){
    return null;
}

    }

/////////////////////////////////////////////////////////////

deleteProductByCart = async (cId, unPid)=> {
    try{
    await cartModel.updateOne(
        { _id: cId },
        { $pull: { products: {product: unPid } } },
        
      );
    }catch(error){
        return null;
    }
}


deleteAllProductByCartId = async (cId)=> {
   try{
    await cartModel.updateOne(
        { _id: cId },
        { $set: { products: [] } }
      );
    }catch(error){
        return null;
    }
}

}

export default CartManager;