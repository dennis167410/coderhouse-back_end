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
    
           // return noDisponibles;
           console.log("t en CartManaeger= " + t);
        console.log("noDisp en CartManager= " + noDisponibles);

        //let retorno = [];

       // retorno.push(noDisponibles, t.amount)
        //console.log("retorno en manager  = " +retorno )
           return t;//noDisponibles;

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
        try {
            const { cartId, products } = cartsData;
            const productId = products[0].id;
            const quantity = products[0].quantity;
    
            // Buscar el carrito por ID
            const cart = await cartModel.findOne({ _id: cartId });
       
            if (!cart) {
                return { message: "Carrito no encontrado" };
            }
    
            // Buscar el usuario por email
            const findUser = await userManager.getUserByEmail(user);
            if (!findUser) {
                return { message: "Usuario no encontrado" };
            }
    
            // Verificar si el carrito ya está asociado a un usuario
            const myCart = findUser.carts.find(cart => cart.cart.toString() === cartId.toString());

            if(!myCart){
               const isAssociated = await userManager.isCartAssociated(cartId);
               console.log("addCart2 -> myCart -> " + isAssociated)
                if (!isAssociated) {
                    //Asociar el carrito al usuario si no está ya asociado
                    findUser.carts.push({ cart: cartId });
                    await findUser.save();
                }else if(isAssociated){
                    return null;//{ message: "Producto no pudo ser agregado al carrito, porque el carrito no le pertenece." };   
                }   
            }  
    
            // Verificar si el producto ya está en el carrito
            const existeElProduct = cart.products.find(item => item.product.toString() === productId.toString());
            if (existeElProduct) {
                // Si el producto está en el carrito, sumar la cantidad
                await cartModel.findOneAndUpdate(
                    { _id: cartId, "products.product": productId },
                    { $inc: { "products.$.quantity": quantity } }
                );
            } else {
                // Obtener el producto por ID
                const product = await productManager.getProductById(productId);
                if (role === "PREMIUM" && user === product.owner) {
                    return { message: "Los usuarios PREMIUM no pueden agregar sus propios productos al carrito" };
                }
    
                // Si el producto no está en el carrito, agregarlo
                await cartModel.findOneAndUpdate(
                    { _id: cartId },
                    { $push: { products: { product: productId, quantity } } }
                );
            }
    
            return { message: "Producto agregado al carrito con éxito" };
        } catch (error) {
            return null;
        }
    };

    
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
    
    addCart3 = async (products, user) => {
        try {
            let newCart = await cartModel.create({});
            
            let r1 = await userManager.getUserByEmail(user);
            let r =  await userManager.addCartInUser(r1._id, newCart._id);
         
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


    addCart4 = async (cartData, userId, rol) => {
        try {
            let newCart = await cartModel.create({});
            const {products} = cartData;
            
            for (const unP of products) {
                const product = await productManager.getProductById(unP.id);
            

                if (product && product.length > 0 ){
                    newCart.products.push({product: unP.id, quantity: unP.quantity})
                  }
                }
        

            if(!newCart.products || newCart.products.length ==0){
               await cartModel.deleteOne({ _id: newCart._id });
               return null;
            }else{

            // Asocia el carrito al usuario:
            let userService = new UserManager();
            console.log("userId = " + userId)
            console.log("newCartId = " + newCart._id)
    
           let r =  await userService.addCartInUserPorVista(userId, newCart._id);
                console.log("r = " + r)

            await cartModel.updateOne({_id:newCart._id}, newCart)
            return newCart._id;
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