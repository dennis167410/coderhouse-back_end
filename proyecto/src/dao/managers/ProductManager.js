import productModel from'../model/product.model.js';

class ProductManager {

    constructor(dao){
        this.dao = dao; 
    }

    getAllProducts = async (unLimit, unaCantPage, unCriterio) => {
        try{
        
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

            const {title, description, code, price, status, stock, category, thumbnails} = productData;

            const product = await productModel.findOne({code:code})

            if(!product){
            const products = await productModel.insertMany(productData)
            
            return products;
            }

            return res.json({
                message: "Error, clave duplicada.",
                }) 

        }catch(error){
            //console.log("Error, clave duplicada.");
            
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
            /*const product = await productModel.updateOne(
                {
                _id: pId,
                },
                {
                $set: {...datos}
                }
            );*/
            
            await productModel.updateOne(
                {_id: pId},
                {$set: {...datos}}
                )
           return await productModel.findById(pId)
           
           //     return product;
        }catch(error){
            //console.log("Error " + error);
            throw new Error(error);
        }
    }


    discountStock = async (codProduct, quantity) => {
        try {
            // Buscar el producto por su código
            const product = await productModel.findOne({ _id: codProduct });
    
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            // Descontará la cantidad vendida del stock
            product.stock -= quantity;
    
            // Guardará el producto actualizado en la base de datos
            await product.save();
    
          //  console.log(`Se descontaron ${quantity} unidades del producto con código ${codProduct}`);
        } catch (error) {
            console.error('Error al descontar el stock:', error.message);
        }
    };
}

export default ProductManager;