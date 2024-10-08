import productModel from'../model/product.model.js';

class ProductManager {

    validFields = ['title', 'description', 'code', 'price', 'status', 'stock', 'category', 'thumbnails', 'owner'];

    constructor(dao){
        this.dao = dao; 
    }

    getAllProducts = async (unLimit, unaCantPage, unCriterio) => {
        try{
        
        const miCriterio = unCriterio === "asc" ? { price: 1 } : { price: -1 };

        const products = await productModel.paginate({},{ limit:unLimit, page:unaCantPage, sort: miCriterio})
        return products;
        }catch(error){
           
        }
    }

    getSortedProducts = async (arr, unCriterio) => {
        try{
            const miCriterio = unCriterio === "asc" ? { price: 1 } : { price: -1 };

            const products = productModel.find({ _id: { $in: arr } }).sort(miCriterio);
           
            return products;
        }catch(error){
           
        }
    }

    getProductById2 = async (unPid) => {
        try {
        //    console.log("unpid en getP() " + unPid)
            const product = await productModel.findOne({_id: unPid}); 
            
            return product; 
        } catch (error) {
            return null;
        }
        /* try{
            try{
            const products = await productModel.find({_id: unPid});
            return products;
            }catch(error){
                return null;
            }
        }catch(error){
            return null;
        }*/
    }


    getProductById = async (unPid) => {
        try {
            comnsole.log("unpid en getP() " + unPid)
            const product = await productModel.findById(unPid); 
            
            return product; 
        } catch (error) {
            return null;
        }
        /* try{
            try{
            const products = await productModel.find({_id: unPid});
            return products;
            }catch(error){
                return null;
            }
        }catch(error){
            return null;
        }*/
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
           
        }
    }

    addProducts = async (productData, user, userRole) => {
        try{
            const {title, description, code, price, status, stock, category, thumbnails, owner} = productData;

            const product = await productModel.findOne({code:code})

             if(!product){
                let newProductData = {...productData}

                if(userRole === "PREMIUM"){
                    newProductData.owner = user;
                }
                const newProduct = await productModel.create(newProductData);
                return newProduct;
            }else{
            return null; 
        }
        }catch(error){
            console.log(error)
         return null;              
        }
    }

    deleteProductById = async (unPid) => {
        try{
            const products = await productModel.deleteOne({_id: unPid});
            return products;
        }catch(error){
           return null;
        }
    }


    updateProduct = async (pId, datos) => { 
        
        const invalidFields = Object.keys(datos).filter(key => !this.validFields.includes(key));
        if (invalidFields.length > 0) {
           return null;
            // throw new Error(`Campos inválidos: ${invalidFields.join(', ')}`);
        }

        try{           
            await productModel.updateOne(
                {_id: pId},
                {$set: {...datos}}
                )
           return await productModel.findById(pId)
            
        }catch(error){
            return null;
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
    
         
        } catch (error) {
            return null;
        }
    };
}

export default ProductManager;