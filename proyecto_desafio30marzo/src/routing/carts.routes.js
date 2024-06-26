const {Router} = require('express');
// const cartData = require('../base_de_datos/carts.js')
// const CartManager = require ('../dao/managers/CartManager.js');
const cartCtrol = require('../controlador/cart.controller.js');
const router = Router();

// Crea un carrito vacio:
router.post('/', cartCtrol.createCart);

// Agrega un producto al carrito
router.post('/agregar', cartCtrol.agregaProductosAlCarrito); 
/*
POSMAN
{
    "cartId": "660570de5c1a20f6af43b13a",
    "productId": "65d0331cd7671692a60e8138",
    "quantity": 28
}
*/

// Crea un carrito con productos:
router.post('/todo', cartCtrol.creaCarritoConProductos);
/*
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


router.get('/', cartCtrol.getAllCarts);

// localhost:8080/api/carts/65d037530195f6c0b3a5beac
router.get("/:cid", cartCtrol.getCartById);

//Si el documento no existe, se insertará en el array products, de lo contrario se le sumará la cantidad
/* Agrega el producto al arreglo “products” del carrito seleccionado. */
router.post("/:cid/product/:pid", cartCtrol.updateCart);


/*
DELETE api/carts/:cid/products/:pid
deberá eliminar del carrito el producto seleccionado.
*/
router.delete("/:cid/products/:pid", cartCtrol.deleteCart);


//////////////////////////////////////////////////

 /* DELETE api/carts/:cid 
  Deberá eliminar todos los productos del carrito
  */
  router.delete("/:cid", cartCtrol.deleteAllProductByCartId);
    
 ///////////////////////////////////////////////////////////////

 /* PUT api/carts/:cid 
 deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
 */
 router.put('/:cid', cartCtrol.updateCartByProduct); 

 ///////////////////////////////////////////////////////////////

 /* PUT api/carts/:cid/products/:pid
 Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
 Si el producto no existe le agrega el producto con la cantidad, de lo contrario incrementa su cantidad.
 */
 router.put("/:cid/products/:pid", cartCtrol.updateQuantity);
   


module.exports = router;
