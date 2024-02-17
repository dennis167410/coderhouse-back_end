const productModel = require('../model/product.model');

class ProductManager {
    getAllProducts = async () => {
        try{
            const products = await productModel.find({});
            return products;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    addProducts = async (productData) => {
        try{
            const products = await productModel.insertMany(productData)
       
            return products;
        }catch(error){
            console.log("Error: ", error);
        }
    }
}

module.exports = ProductManager;