import cartModel from '../model/cart.model.js';

class CartManager {
    constructor(dao){
        this.dao = dao; 
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
            const {cartId, productId, quantity} = cartsData;
            let cart = await cartModel.findOne({_id: cartId});
            cart.products.push({ product: productId, quantity });
            const r = await cart.save();

           return r;
        }catch(error){
            console.log("Error: ", error);
        }
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

            products.forEach(unP=>{
                newCart.products.push({product: unP.id, quantity: unP.quantity})
            });

            const r = await cartModel.updateOne({_id:newCart._id}, newCart)
            return r;
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

    updateCart = async (cId, unPid, quantity)=> {

        try{
       const cart = await cartModel.findOne({ _id: cId });
       console.log("Carrito = ", cart)
       
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