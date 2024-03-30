const CartManager = require ('../dao/managers/CartManager.js');

createCart = async(req, res) => {
    try{
        const cartBody = req.body;
        const cartManager = new CartManager();
        const newCart = await cartManager.addCarts1(cartBody); 
       
        return res.json({
            message: 'Nuevo carrito agregado.',
            cart: newCart

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
}

agregaProductosAlCarrito = async(req, res) => { 
    try{
        const cartData2 = req.body;
        const cartManager = new CartManager();
        console.log("AGREGAR = ", cartData2)
        const result = await cartManager.addCart2(cartData2); 
       
        return res.json({
            message: 'Productos agregados al carrito.',
            prueba: result

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
}

creaCarritoConProductos = async(req, res) => { 
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
            
            const newCart = await cartManager.addCart3(cartBody); 
           
            return res.json({
                message: 'Nuevo carrito con productos agregado.',
                cart: newCart
    
            }) 
        }catch(error){
            console.log("Error... ", error)
        }
}

getAllCarts = async (req, resp) => {
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
}

getCartById = async(req, res) =>{
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
    
        return res.json({ 
            ok: true,
            message: 'Productos del carrito...',
            cart,
        })       
    }catch(error){
        console.log("Error... ", error)
    }
}

updateCart = async(req, res) => {
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
       
       // CAMBIAR, HACE QUE SEA UN FIND AL CARRITO PARA TRAER DATOS ACUTLIZADOS. return await cartModel.findById(cId)
       return res.json({ok: true, message: "Correcta actualización del carritos", Carrito: respuesta});
   
       }catch(error){
   
       }
      
       return res.json({ok: true, message: "Error al intentar actualizar el carrito."}); 
         
       }


       deleteCart = async(req, res) =>{
        try{
            const cId =  req.params.cid;
            const pId =  req.params.pid;
    
            const cartManager = new CartManager();
            const respuesta = await cartManager.deleteProductByCart(cId, pId); 
            
            if(respuesta === null){
                return res.json({ok: false, message: "Error al intentar eliminar el producto del carrito."}); 
            }
            
            return res.json({ok: true, message: "Producto eliminado del carrito.", Carrito: respuesta});
        
            }catch(error){
                console.log(error)
            }
        }

        deleteAllProductByCartId = async(req, res) =>{
            try{
                const cId =  req.params.cid;
            
                const cartManager = new CartManager();
                const respuesta = await cartManager.deleteAllProductByCartId(cId); 
                
                if(respuesta === null){
                    return res.json({ok: false, message: "Error al intentar vaciar el carrito."}); 
                }
                
                return res.json({ok: true, message: "Fueron eliminados todos los productos del carrito.", Carrito: respuesta});
            
                }catch(error){
                    console.log(error)
                }
        }  

        updateCartByProduct =  async (req, res) => {
            const cartId = req.params.cid;
            try {       
                const cartManager = new CartManager();
                const cart = await cartManager.getCartById(cartId); 
                
                if (!cart) {
                    return res.status(404).json({ message: 'Carrito no encontrado' });
                }
                await cart.save();
        
                res.json({ message: 'Carrito actualizado correctamente', cart });
            } catch (error) {
                console.error('Error al actualizar el carrito:', error);
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        };

        updateQuantity =  async(req, res) => {
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
            
            // RESPUESTA cambiar por un find para que los datos los muestre actualizado.  return await cartModel.findById(cId)
            return res.json({ok: true, message: "Actualización correcta.", Carrito: respuesta});
        
            }catch(error){ }
           
            return res.json({ok: true, message: "En construcción."}); 
              
            };

module.exports = {
    createCart,
    agregaProductosAlCarrito,
    creaCarritoConProductos,
    getAllCarts,
    getCartById,
    updateCart,
    deleteCart,
    deleteAllProductByCartId,
    updateCartByProduct,
    updateQuantity,
}