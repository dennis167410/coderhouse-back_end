import {CartService} from '../repository/index.js';
import { sendEmail } from '../routing/email.routes.js';

export default class CartController{
    cartService;

    constructor(){
        this.cartService = CartService;
    }

    finalizePurchase = async(req, res) => {
        try{
            const { cid } = req.params;

           req.logger.info("finalizar cid = " + cid)
            const result = await this.cartService.finalizePurchase(cid);
          
            req.logger.error(result)

            if(result === 401){
                return res 
                .status(401)
                .json({
                    message: 'Error, deberá asociar el carrito al usuario.',
                })
            }

            if (!result) {
                req.logger.error('Carrito no encontrado.')
                return res 
                .status(400)
                .json({
                    message: 'Carrito no encontrado',
                })
            }

            console.log("result = " + result)
            /*
            return res.status(200).json({
                message: 'Ticket cerrado.',
                ticket: result.ticket.amount, 
                noDisponibles: result.noDisponibles
            });*/

          
            let retorno = "";
            result.forEach(r =>{
                retorno += "Sr./a: " + r.purchaser+ " el ticket de número: " + r.code + " fue cerrado correctamente. Usted debe abonar " + r.amount + " pesos.";
            }
            )
          
            sendEmail(
                req.session.user,
                "Ticket cerrado",
                `${retorno}`
            );

            return this.handleResponsePurcharse(req, res, {message: `${retorno}`}, 200); 
       
            /*return res
                .status(200)
                .json({
                message: 'Ticket cerrado.',
                ticket: `Productos que no pudieron procesarse... ${ticket}`
    
            })*/ 
        }catch(error){
            req.logger.error('Error... ', error);
        }
    }

    createCart = async(req, res) => {
        try{          
        const newCart = await this.cartService.addCarts1();
        req.logger.info('Nuevo carrito vacío agregado.'); 
        return res
            .status(200)
            .json({
            message: 'Nuevo carrito vacío agregado.',
            cart: newCart
        })
    }catch(error){
        req.logger.error("Error... ", error)
    }
}

agregaProductoAlCarrito = async(req, res) => { 
    /*
    {
      cartId: "660570de5c1a20f6af43b13a",
            products: [
                 {
                    id: "65d0331cd7671692a60e8138",
                    quantity: 1
                }  
            ]
    }
    
    */
    
    try{
        const cartData2 = req.body;       
        const result = await this.cartService.addCart2(cartData2, req.session.user, req.session.role);
        
        if(result || result != null){
            req.logger.info("Producto agregado al carrito.");
        return res
            .status(200)
            .json({
            message: 'Producto agregado al carrito.',
            result

        })
        }else{
            req.logger.error("El producto no pudo ser agregado al carrito.");
            return res
            .status(400)
            .json({
            message: 'Error, el producto no pudo ser agregado al carrito. Motivos: El carrito no le pertence o no existe o el producto no tiene stock disponible.',
        })
        } 

    }catch(error){
        req.logger.error("Error... ", error)
    }
}

creaCarritoConProductosDesdeLaVista = async(req, res) => { 
     
            try{
    
                const cartData2 = req.body;
                req.logger.info("Agrega desde la vista = " + cartData2)

               let newCart = await this.cartService.addCart4(cartData2, req.session.user, req.session.role); 
    
                if(!newCart || newCart === null){
                    return this.handleResponsePurcharse(req, res, {message: "El carrito no pudo ser creado, faltan datos o no existe el producto."}, 400); 
                  /*  return res
                    .status(400)
                    .json({
                    message: `El carrito no pudo ser creado, faltan datos o no existe el prodcuto.`,
                    })*/
                }
    
               
                return this.handleResponsePurcharse(req, res, {message: "Nuevo carrito con productos creado correctamente ", cart:newCart}, 200);
              /*  return res
                    .status(200)
                    .json({
                    message: `Nuevo carrito con productos creado correctamente`,
                    cart: newCart
            })*/
            
             
            }catch(error){
                req.logger.error("Error... ", error)
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

            const { products} = req.body;
                   
           // let newCart = await this.cartService.addCart3(cartBody); 
           let newCart = await this.cartService.addCart3(products, req.session.user); 

            if(!newCart || newCart === null){
                return res
                .status(400)
                .json({
                message: `El carrito no pudo ser creado, faltan datos o no existe el producto.`,
                })
            }

            return res
                .status(200)
                .json({
                message: `Nuevo carrito con productos creado correctamente`,
                cart: newCart
           })     
        }catch(error){
            req.logger.error("Error... ", error)
        }
}

 getAllCarts = async (req, resp) => {
    try{
        const carts = await this.cartService.getAllCarts(); 

        return resp
        .status(200)
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

        console.log(cart)
        if(!cart || cart == null){
            req.logger.error("El carrito no existe");
            return res
            .status(404)
            .json({
                ok: true,
                message: 'Carrito no existe...'
            })
        }
    
        return res
            .status(200)
            .json({ 
            ok: true,
            message: 'Productos del carrito...',
            cart,
        })       
    }catch(error){
        res.logger.error("Error... ", error)
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
       
       if(respuesta === null){
        req.logger.error("Error al intentar actualizar el carrito");
        return res
        .status(400)
        .json({ok: false, message: "Error al intentar actualizar el carrito"}); 
       }
       
       return res
       .status(200)
       .json({
        message: respuesta,
       })

       }catch(error){
        req.logger.error("Error, ", error);
       }
      
       return res
       .status(400)
       .json({ok: true, message: "Error al intentar actualizar el carrito."}); 
         
       }


      deleteCart = async(req, res) =>{
        
        try{

            const cId =  req.params.cid;
            const pId =  req.params.pid;
    
            const respuesta = await this.cartService.deleteProductByCart(cId, pId); 
            if(respuesta === null){
                req.logger.error("Error al intentar eliminar el producto del carrito.");
                return res.json({ok: false, message: "Error al intentar eliminar el producto del carrito."}); 
            }
            
            return res.json({ok: true, message: "Producto eliminado del carrito.", Carrito: respuesta});
        
            }catch(error){
                req.logger.error(error);
            }
        }


         deleteAllProductByCartId = async(req, res) =>{
            try{
                const cId =  req.params.cid;
            
                const respuesta = await this.cartService.deleteAllProductByCartId(cId); 
                
                if(respuesta === null){
                    return res
                    .status(400)
                    .json({ok: false, message: "Error al intentar vaciar el carrito."}); 
                }
                
                return res
                .status(200)
                .json({ok: true, message: "Fueron eliminados todos los productos del carrito.", Carrito: respuesta});
            
                }catch(error){
                    req.logger.error(error);
                }
        }  

         updateCartByProduct =  async (req, res) => {
            const cartId = req.params.cid;
            try {       
                const cart = await this.cartService.getCartById(cartId); 
                
                if (!cart) {
                    req.logger.info("Carrito no encontrado.")
                    return res.status(404).json({ message: 'Carrito no encontrado.' });
                }
                await cart.save();
        
                res.json({ message: 'Carrito actualizado correctamente', cart });
            } catch (error) {
                req.logger.error('Error al actualizar el carrito:', error);
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
            req.logger.error("Error (cart.controller.js) = ", error)
             }      
            };

            handleResponsePurcharse = (req, res, response, statusCode) => {
                if (req.headers['content-type'] === 'application/json' || req.xhr) {
                    return res.status(statusCode).json(response);
                } else {
                    return res.status(statusCode).render('purcharse', response);
                }
              };
 }

         