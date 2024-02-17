const {Router} = require('express');
const productData = require('../base_de_datos/products.js')
const ProductManager = require ('../dao/managers/ProductManager.js');

const router = Router();

router.post('/', async (req, resp) =>{
    try{
       
        const productData2 = req.body;
        
        const productManager = new ProductManager();

        const result = await productManager.addProducts(productData2); 
       

     /*   if(result){
            return resp
            .status(404)
            .json({
                ok: true,
                message: 'El producto ya existe',
            })
        }*/

        return resp.json({
            message: result,
            

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
})

router.get('/', async (req, resp) =>{
    try{
        const productManager = new ProductManager();
        const products = await productManager.getAllProducts(); 

        return resp
        .status(500)
        .json({
            ok: true,
            message: 'Listado de productos...',
            products,
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


router.put('/:pid', async(req, res) => {
    
      return res.json({ok: false, message: "En construcción."});
    
})


module.exports = router;
