const cartModel = require('../model/cart.model');
const productModel = require('../model/product.model');

class CartManager {

    addCarts1 = async (cartsData) => {
        try{
            
            let newCart = await cartModel.create({cartsData});

            //const carts = await cartModel.insertMany(cartsData)
             
            return newCart;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    addCart2 = async (cartsData) => {
        try{
            const {cartId, productId, quantity} = cartsData;
            let cart = await cartModel.findOne({_id: cartId});

            cart.products.push({product: productId, quantity});
            const r = await cartModel.updateOne({_id:cartId}, cart)
            //const carts = await cartModel.insertMany(cartsData)
       

           return r;
        }catch(error){
            console.log("Error: ", error);
        }
    }

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
            const cart = await cartModel.findOne({_id: unCid});
            return cart;
        }catch(error){
            console.log("Error: ", error);
        }
    
    }

/////////////////////////////////////////////////////////////

    updateCart = async (cId, unPid, datos)=> {

        const existingDocument = await cartModel.findOne({ _id: cId });

        const result = await cartModel.findOne({ "products.id": unPid });

if (existingDocument && result) {
   const cart = await cartModel.findOneAndUpdate(
        { _id: cId, "products.id": unPid },
        { $inc: { "products.$.quantity": datos } },
        { returnOriginal: false }
    );
   } else{
        // PROBAR: updateOne
        await cartModel.findOneAndUpdate(
            { _id: cId },
            { $push: { products: { id: unPid, quantity: datos } } },
            { upsert: true }
        );
    }

    }
/////////////////////////////////////////////////////////////

deleteProductByCart = async (cId, unPid)=> {
    await cartModel.updateOne(
        { _id: cId },
        { $pull: { products: { id: unPid } } },
        
      );
}

deleteAllProductByCartId = async (cId)=> {
    await cartModel.updateOne(
        { _d: cId },
        { $set: { products: [] } }
      );
}

}



module.exports = CartManager;