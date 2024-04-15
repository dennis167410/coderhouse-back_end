
import {ProductService} from '../repository/index.js';
import ProductDto from '../dto/Product.dto.js';

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
        console.log("Error... ", error)
    }
}

createProduct = async(req, res) => {
    try{
       
        const productData2 = req.body; 
        
        const result = await this.productService.addProducts(productData2); 
        
        if(!result){
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
        //console.log("Error... ", error)
    }
}

getProductById = async( req, res) =>{
    try{
        const productId = req.params.pid;
        const product = await this.productService.getProductById(productId); 

        if(!product){
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
        console.log("Error... ", error)
    }
}

productsByCategory = async( req, res) => {
    try{
        const productCategory = req.params.category;
        const { sort } = req.body;

        const products = await this.productService.productsByCategory(productCategory, sort); 

       if(!products){
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
        console.log("Error... ", error)
    }
}

productsByDispo = async(req, res) => {
    try{
        const productDispo = req.params.disponibilidad;
        const { sort } = req.body;

        const products = await this.productService.productsByDispo(productDispo, sort); 

       if(!products){
            return res
            .status(404)
            .json({
                ok: true,
                message: 'No existen productos en para esa categoria.'
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
        console.log("Error... ", error)
    }
}

deleteProductById = async(req, res) => {
    try{
        const productId = req.params.pid;
        const product = await this.productService.deleteProductById(productId); 

        if(!product){
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
        console.log("Error... ", error)
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

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Producto actualizado.',
            product,
        })
    }catch(error){
        console.log("Error... ", error)
    }
}

}


/*
const productManager = new ProductManager();

const createProduct = async(req, res) => {
    try{
       
        const productData2 = req.body; 
        
        const result = await productManager.addProducts(productData2); 
        
        if(!result){
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
        //console.log("Error... ", error)
    }
}



const getProductById = async( req, res) =>{
    try{
        const productId = req.params.pid;

        //const productManager = new ProductManager();
        const product = await productManager.getProductById(productId); 

        if(!product){
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
        console.log("Error... ", error)
    }
}

const productsByCategory = async( req, res) => {
    try{
        const productCategory = req.params.category;
        const { sort } = req.body;

        const products = await productManager.productsByCategory(productCategory, sort); 

       if(!products){
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
        console.log("Error... ", error)
    }
}

const productsByDispo = async(req, res) => {
    try{
        const productDispo = req.params.disponibilidad;
        const { sort } = req.body;

        const products = await productManager.productsByDispo(productDispo, sort); 

       if(!products){
            return res
            .status(404)
            .json({
                ok: true,
                message: 'No existen productos en para esa categoria.'
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
        console.log("Error... ", error)
    }
}

const deleteProductById = async(req, res) => {
    try{
        const productId = req.params.pid;
        const product = await productManager.deleteProductById(productId); 

        if(!product){
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
        console.log("Error... ", error)
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
/*
 const updateProduct = async(req, res) => {
    try{
        const productId =  req.params.pid;
       
        const product = await productManager.updateProduct(productId, req.body); 

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Producto actualizado.',
            product,
        })
    }catch(error){
        console.log("Error... ", error)
    }
} */

/*module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    productsByCategory,
    productsByDispo,
    deleteProductById,
    updateProduct,
}*/

/*
export default {
    getProductById,
    createProduct,
    getAllProducts,
    productsByCategory,
    productsByDispo,
    deleteProductById,
    updateProduct,
}*/