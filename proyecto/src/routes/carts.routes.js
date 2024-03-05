const {Router} = require('express');
const cartData = require('../base_de_datos/carts.js')
const CartManager = require ('../dao/managers/CartManager.js');

const router = Router();

// Crea un carrito vacio:
router.post('/', async (req, resp) =>{
    try{
        const cartBody = req.body;
        const cartManager = new CartManager();
        const newCart = await cartManager.addCarts1(cartBody); 
       
        return resp.json({
            message: 'Nuevo carrito agregado.',
            cart: newCart

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
})

// Agrega un producto al carrito
router.post('/agregar', async (req, resp) =>{
    try{
        const cartData2 = req.body;
        const cartManager = new CartManager();
        const result = await cartManager.addCart2(cartData2); 
       
        return resp.json({
            message: 'Productos agregados al carrito.',
            prueba: result

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
})

// Crea un carrito con productos:
router.post('/todo', async (req, resp) =>{
 // POSMAN - body:
        /*
        {
            "products": [
                {
                    "id": "65d0da9c67a60e76e813a55b",
                    "quantity": 1
                },
                {
                    "id": "65d0df5059466c039711e36c",
                    "quantity": 2
                }
            ]
        }
        */

    try{
        const cartBody = req.body;
        const cartManager = new CartManager();
        
       // console.log(cartBody)
        
        const newCart = await cartManager.addCart3(cartBody); 
       
        return resp.json({
            message: 'Nuevo carrito con productos agregado.',
            cart: newCart

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

        /*const formatoDelDocumento = cart.products.map(doc => {
            return {
                id: doc.id,
                quantity: doc.quantity,
            };
        });*/

        return res.json({ 
            ok: true,
            message: 'Productos del carrito...',
            cart,
        })
  //      return res.render('carts', {misProductos: formatoDelDocumento}) 
       
    }catch(error){
        console.log("Error... ", error)
    }
})

//Si el documento no existe, se insertará en el array products, de lo contrario se le sumará la cantidad
/* Agrega el producto al arreglo “products” del carrito seleccionado. */
router.post("/:cid/product/:pid", async(req, res) => {
 //POSMAN
    /*
      {
        "quantity": 4
        }
    */
    try{
    const cId =  req.params.cid;
    const pId =  req.params.pid;

    const product = req.body;

    const unaCantidad = product.quantity;

    const cartManager = new CartManager();
    const respuesta = await cartManager.updateCart(cId, pId, unaCantidad); 
    
    if(respuesta === null){
        return res.json({ok: false, message: "Error al intentar actualizar el carrito"}); 
    }
    
    return res.json({ok: true, message: "_____", Carrito: respuesta});

    }catch(error){

    }
   
    return res.json({ok: true, message: "En construcción."}); 
      
    })

    ///////////////////////////////////////////////////

    /*
    DELETE api/carts/:cid/products/:pid
    deberá eliminar del carrito el producto seleccionado.
    */
    router.delete("/:cid/products/:pid", async(req, res) =>{
        try{
            const cId =  req.params.cid;
            const pId =  req.params.pid;
        
            const cartManager = new CartManager();
            const respuesta = await cartManager.deleteProductByCart(cId, pId); 
            
            if(respuesta === null){
                return res.json({ok: false, message: "Error al intentar eliminar el producto del carrito."}); 
            }
            
            return res.json({ok: true, message: "_____", Carrito: respuesta});
        
            }catch(error){
                console.log(error)
            }
    })  

    //////////////////////////////////////////////////

    /* DELETE api/carts/:cid 
    Deberá eliminar todos los productos del carrito
    */
    router.delete("/:cid", async(req, res) =>{
        try{
            const cId =  req.params.cid;
        
            const cartManager = new CartManager();
            const respuesta = await cartManager.deleteAllProductByCartId(cId); 
            
            if(respuesta === null){
                return res.json({ok: false, message: "Error al intentar vaciar el carrito."}); 
            }
            
            return res.json({ok: true, message: "_____", Carrito: respuesta});
        
            }catch(error){
                console.log(error)
            }
    })  
   
   ///////////////////////////////////////////////////////////////

   /* PUT api/carts/:cid 
   deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
   */
   router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    //const newProducts = req.body.products;

    console.log("CARRITO = " + cartId);
    //console.log("NEW PRODUCTS = " + newProducts)

    try {
        // Buscar el carrito por su ID
        
        const cartManager = new CartManager();
        const cart = await cartManager.getCartById(cartId); 
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Actualizar los productos del carrito
      //  cart.products = newProducts;

        // Guardar los cambios en la base de datos
        await cart.save();

        res.json({ message: 'Carrito actualizado correctamente', cart });
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});


   ///////////////////////////////////////////////////////////////

   /* PUT api/carts/:cid/products/:pid
    Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
    Si el producto no existe le agrega el producto con la cantidad, de lo contrario incrementa su cantidad.
    */
    router.put("/:cid/products/:pid", async(req, res) => {
        //POSMAN
           /*
             {
               "quantity": 4
               }
           */
           try{
           const cId =  req.params.cid;
           const pId =  req.params.pid;
       
           const product = req.body;
       
           const unaCantidad = product.quantity;
       
           const cartManager = new CartManager();
           const respuesta = await cartManager.updateCart(cId, pId, unaCantidad); 
           
           if(respuesta === null){
               return res.json({ok: false, message: "Error al intentar actualizar el carrito"}); 
           }
           
           return res.json({ok: true, message: "_____", Carrito: respuesta});
       
           }catch(error){
       
           }
          
           return res.json({ok: true, message: "En construcción."}); 
             
           })


   


module.exports = router;
