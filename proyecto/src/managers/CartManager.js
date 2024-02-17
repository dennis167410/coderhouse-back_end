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
}

module.exports = CartManager;