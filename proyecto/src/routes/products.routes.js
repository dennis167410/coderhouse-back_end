const {Router} = require('express');
const productData = require('../base_de_datos/products.js')
const ProductManager = require ('../managers/ProductManager.js');

const router = Router();

router.post('/', async (req, resp) =>{
    try{
       
        const productManager = new ProductManager();
        const result = await productManager.addProducts(productData); 
       
        return resp.json({
            message: 'Exitosa inserción masiva.',
            prueba: result

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


module.exports = router;
