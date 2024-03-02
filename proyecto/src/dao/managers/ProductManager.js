const productModel = require('../model/product.model');

class ProductManager {
    getAllProducts = async (unLimit, unaCantPage, unCriterio) => {
        try{
        console.log(unCriterio)
        const miCriterio = unCriterio === "asc" ? { price: 1 } : { price: -1 };

        const products = await productModel.paginate({},{ limit:unLimit, page:unaCantPage, sort: miCriterio})
        return products;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    getSortedProducts = async (arr, unCriterio) => {
        try{
            const miCriterio = unCriterio === "asc" ? { price: 1 } : { price: -1 };

            const products = productModel.find({ _id: { $in: arr } }).sort(miCriterio);
           
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


    productsByCategory = async (unaCat, miCriterio) => {
        try{
         
            let sortCriterio = {};
            if (miCriterio === 'asc') {
                sortCriterio.price = 1;
            } else if (miCriterio === 'desc') {
                sortCriterio.price = -1;
            }
    
            const products = await productModel.find({ category: unaCat }).sort(sortCriterio);
        
            return products;
        }catch(error){
            console.log("Error: ", error);
        }
    }

    // Busqueda por disponibilidad:
    productsByDispo = async (unaDispo, miCriterio) => {
        try{
            
            let sortCriterio = {};
            if (miCriterio === 'asc') {
                sortCriterio.price = 1;
            } else if (miCriterio === 'desc') {
                sortCriterio.price = -1;
            }

            const products = await productModel.find({ stock: { $gt: unaDispo } }).sort(sortCriterio);
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


    updateProduct = async (pId, datos) => { 
        try{
            const product = await productModel.updateOne(
                {
                _id: pId,
                },
                {
                $set: datos
                }
            );
            return product;
        }catch(error){
            console.log("Error " + error);
        }
    }

}

module.exports = ProductManager;