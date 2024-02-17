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

    getProductById = async (unPid) => {
        try{
            const products = await productModel.find({_id: unPid});
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
            console.log("Error, clave duplicada.");
            
        }
    }

    deleteProductById = async (unPid) => {
        try{
            const products = await productModel.deleteOne({_id: unPid});
            return products;
        }catch(error){
            console.log("Error: ", error);
        }
    }


    updateProduct = async (unId, title, description, price, status, stock, category, thumbnail) => {
    
    }

}

module.exports = ProductManager;