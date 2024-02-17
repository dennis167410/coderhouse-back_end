const cartModel = require('../model/cart.model');

class CartManager {
    getAllCarts = async () => {
        try{
            const carts = await cartModel.find({});
            return carts;
        }catch(error){
            console.log("Error: ", error);
        }
    }


    addCarts = async (cartsData) => {
        try{
            const carts = await cartModel.insertMany(cartsData)
       
            return carts;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    getCartById = async (unCid) => {
        try{
            const cart = await cartModel.findOne({_id: unCid});
            return cart;
        }catch(error){
            console.log("Error: ", error);
        }
    
    }

    updateCart = async (unCid, unPid, unaCantidad)=> {

    }



}

module.exports = CartManager;