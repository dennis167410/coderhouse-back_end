const {Router} = require('express');
const cartData = require('../base_de_datos/carts.js')
const CartManager = require ('../dao/managers/CartManager.js');

const router = Router();

router.post('/', async (req, resp) =>{
    try{
        const cartData2 = req.body;
        const cartManager = new CartManager();
        const result = await cartManager.addCarts(cartData2); 
       
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

// localhost:8080/api/carts/65d037530195f6c0b3a5beac
router.get("/:cid", async(req, res) =>{
    try{
        const cartId = req.params.cid;
        const cartManager = new CartManager();
        const cart = await cartManager.getCartById(cartId); 

        if(!cart){
            return res
            .status(404)
            .json({
                ok: true,
                message: 'Carrito no existe...'
            })
        }

        return res
        .status(500)
        .json({
            ok: true,
            message: 'Carrito...',
            cart,
        })
    }catch(error){
        console.log("Error... ", error)
    }
})

router.post("/:cid/product/:pid", async(req, res) => {

    //POSMAN
    /*
        {
        "product": {
            "quantity": 4
                    }
        }
    */
      /* const cid = req.params.cid;
       const pid = req.params.pid;
       const product = req.body;
       const unaCantidad = product.product.quantity;
    */
    //   try{
           
            return res.json({ok: true, message: "En construcción."}); 
            
      //  }catch(error){
        //    console.log(error)
       // }
    
    })


module.exports = router;
