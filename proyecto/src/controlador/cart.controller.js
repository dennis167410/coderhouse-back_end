import {CartService} from '../repository/index.js';
//import CartDto from '../dto/Cart.dto.js';

export default class CartController{
    cartService;

    constructor(){
        this.cartService = CartService;
    }

    finalizePurchase = async(req, res) => {
        try{
            const { cid } = req.params;

            const ticket = await this.cartService.finalizePurchase(cid);
            console.log(ticket)
            if (!ticket) {
                return res 
                .status(400)
                .json({
                    message: 'Carrito no encontrado',
                })
            }

            return res

                .status(200)
                .json({
                message: 'Ticket',
                ticket: `Productos que no pudieron procesarse... ${ticket}`
    
            }) 
        }catch(error){
            console.log('Error... ', error);
        }
    }

    createCart = async(req, res) => {
    try{
        const cartBody = req.body;
        const newCart = await this.cartService.addCarts1(cartBody); 
       
        return res.json({
            message: 'Nuevo carrito agregado.',
            cart: newCart

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
}

agregaProductoAlCarrito = async(req, res) => { 
    try{
       // console.log("agregaProductosAlCarrito ", req.session.user)
        const cartData2 = req.body;
        const result = await this.cartService.addCart2(cartData2, req.session.user); 
        return res.json({
            message: 'Producto agregado al carrito.',
            message: result

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
            
            let newCart = await this.cartService.addCart3(cartBody); 
           
            return res
                .status(200)
                .json({
                message: `Productos no procesados...`,
                 cart: newCart

    })
         
        }catch(error){
            console.log("Error... ", error)
        }
}

 getAllCarts = async (req, resp) => {
    try{
        const carts = await this.cartService.getAllCarts(); 

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
        const cart = await this.cartService.getCartById(cartId); 

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
   
       const respuesta = await this.cartService.updateCart(cId, pId, unaCantidad); 
       
       //console.log(respuesta)
       if(respuesta === null){
           return res.json({ok: false, message: "Error al intentar actualizar el carrito"}); 
       }
       
       return res.json({
        message: respuesta,
       })

       }catch(error){
        console.log(error)
       }
      
       return res.json({ok: true, message: "Error al intentar actualizar el carrito."}); 
         
       }


      deleteCart = async(req, res) =>{
        try{
            const cId =  req.params.cid;
            const pId =  req.params.pid;
    
            const respuesta = await this.cartService.deleteProductByCart(cId, pId); 
            
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
            
                const respuesta = await this.cartService.deleteAllProductByCartId(cId); 
                
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
                const cart = await this.cartService.getCartById(cartId); 
                
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
        
            const respuesta = await this.cartService.updateCart(cId, pId, unaCantidad); 
            
            if(respuesta === null){
                return res.json({ok: false, message: "Error al intentar actualizar el carrito"}); 
            }
            
            // RESPUESTA cambiar por un find para que los datos los muestre actualizado.  return await cartModel.findById(cId)
            return res.json({ok: true, message: "Actualización correcta.", Carrito: respuesta});
        
            }catch(error){
                console.log("Error (cart.controller.js) = ", error)
             }      
            };
 }

         