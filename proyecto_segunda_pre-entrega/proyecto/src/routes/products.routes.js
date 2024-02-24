const {Router} = require('express');
const productData = require('../base_de_datos/products.js')
const ProductManager = require ('../dao/managers/ProductManager.js');

const router = Router();

router.post('/', async (req, resp) =>{
    try{
       
        const productData2 = req.body;
        
        const productManager = new ProductManager();

        const result = await productManager.addProducts(productData2); 
       
        return resp.json({
            message: result,
            

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
})

// Ejemplo: http://localhost:8080/api/products?limit=5
// http://localhost:8080/api/products/?limit=5&sort=asc
// http://localhost:8080/api/products?limit=5&page=2&sort=desc&query=find
router.get('/', async (req, resp) =>{
    try{

        const {limit=10, page=1, sort, query} = req.query;

        const productManager = new ProductManager();

     const { 
        docs,
        totalDocs,
        limit:limitPage,
        totalPages,
        hasNextPage,
        prevPage,
        nextPage
     } = await productManager.getAllProducts(limit, page, sort);

            return resp
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
})

// localhost:8080/api/products/65ceb99486869118617b2cef
router.get("/:pid", async(req, res) =>{
    try{
        const productId = req.params.pid;
        const productManager = new ProductManager();
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
})

// localhost:8080/api/products/cat1
router.get("/category/:category", async(req, res) =>{
    try{
        const productCategory = req.params.category;
        const { sort } = req.body;

        const productManager = new ProductManager();
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
})

router.get("/disponibilidad/:disponibilidad", async(req, res) =>{
    try{
        const productDispo = req.params.disponibilidad;
        const { sort } = req.body;
        const productManager = new ProductManager();
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
})

// localhost:8080/api/products/65ceb99486869118617b2cef
router.delete("/:pid", async(req, res) => {
  try{
        const productId = req.params.pid;
        const productManager = new ProductManager();
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
})


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
router.put('/:pid', async(req, res) => {

    try{
        const productId =  req.params.pid;

        const productManager = new ProductManager();
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
})


module.exports = router;
