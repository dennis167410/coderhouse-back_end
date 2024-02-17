const {Router} = require('express');
const cartData = require('../base_de_datos/carts.js')
const CartManager = require ('../managers/CartManager.js');

const router = Router();

router.post('/', async (req, resp) =>{
    try{

        const cartManager = new CartManager();
        const result = await cartManager.addCarts(cartData); 
       
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
        const cartManager = new CartManager();
        const carts = await cartManager.getAllCarts(); 

        return resp
        .status(500)
        .json({
            ok: true,
            message: 'Listado de carritos...',
            carts,
        })
    }catch(error){
        console.log("Error... ", error)
    }
})

module.exports = router;
