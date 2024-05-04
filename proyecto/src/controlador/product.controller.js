
import {ProductService} from '../repository/index.js';

export default class ProductController{
    productService;

    constructor(){
        this.productService = ProductService;
    }


 getAllProducts = async(req, res) => {
    try{
        const {limit=10, page=1, sort, query} = req.query;
     const { 
        docs,
        totalDocs,
        limit:limitPage,
        totalPages,
        hasNextPage,
        prevPage,
        nextPage
     } = await this.productService.getAllProducts(limit, page, sort);

            return res
            .status(500)
            .json({
           
        message:"Todos los productos",
        products: docs,
        length: totalDocs,
        limit: limitPage,
        page,
        totalPages,
        hasNextPage,
        prevPage,
        nextPage

            })

    }catch(error){
        req.logger.error("Error ", error);
    }
}

createProduct = async(req, res) => {
    try{
       
        const productData2 = req.body; 
        
        const result = await this.productService.addProducts(productData2); 
        
        if(!result){
            req.logger.warning('No se pudo crear el producto. Faltan datos o la clave puede estar duplicada.');
            return res
            .status(404)
            .json({
                message: "Error, clave duplicada",
            })
        }

        return res.json({
            message: result,
        })
        
        
    }catch(error){
        req.logger.error("Error ", error);
    }
}

getProductById = async( req, res) =>{
    try{
        const productId = req.params.pid;
        const product = await this.productService.getProductById(productId); 

        if(!product){
            req.logger.warning('El producto no existe.');
            return res
            .status(404)
            .json({
                ok: true,
                message: 'Producto no existe...'
            })
        }

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Producto...',
            product,
        })
    }catch(error){
        req.logger.error('Error, ', error);
    }
}

productsByCategory = async( req, res) => {
    try{
        const productCategory = req.params.category;
        const { sort } = req.body;

        const products = await this.productService.productsByCategory(productCategory, sort); 

       if(!products || products.length === 0){
            req.logger.info('No existen productos en la categoria para mostrar.');
            return res
            .status(404)
            .json({
                ok: true,
                message: 'No existen productos para esa categoria.'
            })
        }

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Productos...',
            products,
        })
    }catch(error){
        req.logger.error('Error, ', error);
    }
}

productsByDispo = async(req, res) => {
    try{
        const productDispo = req.params.disponibilidad;
        const { sort } = req.body;

        const products = await this.productService.productsByDispo(productDispo, sort); 

       if(!products || products.length === 0){
            req.logger.info('No existen productos con esa disponibilidad.');
            return res
            .status(404)
            .json({
                ok: true,
                message: 'No existen productos con esa disponibilidad.'
            })
        }

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Productos con dispopnibilidad' ,
            products,
        })
    }catch(error){
        req.logger.info('Error, ', error);
    }
}

deleteProductById = async(req, res) => {
    try{
        const productId = req.params.pid;
        const product = await this.productService.deleteProductById(productId); 

        if(!product){
            req.logger.info("El producto no existe.");
            return res
            .status(404)
            .json({
                ok: true,
                message: 'Producto no existe...'
            })
        }

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Producto eliminado.',
            product,
        })
    }catch(error){
        req.logger.error("Error ", error);
    }
}


/*
POSMAN:
   PUT localhost:8080/api/products/65ceb99486869118617b2cef
En el body:
    {
        "description": "Producto prueba actualización mongo",
        "price": 10, 
        "stock": 10
    }
*/

 updateProduct = async(req, res) => {
    try{
        const productId =  req.params.pid;
    
        const product = await this.productService.updateProduct(productId, req.body); 
       
        if(!product){
            req.logger.info("El producto no existe, por tal motivo no pudo ser actualizado.");
            return res
            .status(400)
            .json({
                ok: false,
                message: 'El producto no existe, por tal motivo no pudo ser actualizado.'
            })     
        }

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Producto actualizado.',
            product,
        })
    }catch(error){
       req.logger.error("Error, ", error)
    }
}

}
