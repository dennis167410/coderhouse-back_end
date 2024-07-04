import {Router} from 'express';
import CartCtrol from '../controlador/cart.controller.js'; 
import handlePolicies from '../middleware/handle-policies.middleware.js';

const router = Router();

const cartCtrol = new CartCtrol();

//Permitirá finalizar el proceso de compra de dicho carrito.
router.post('/:cid/purchase', cartCtrol.finalizePurchase)

// Crea un carrito vacio:
router.post('/', cartCtrol.createCart);

// Agrega un producto al carrito. El mail del USER debe ser igual al mail del dueño del carrito. 
router.post('/agregar', handlePolicies(["USER", "PREMIUM"]), cartCtrol.agregaProductoAlCarrito); 
/*
POSMAN
{
cartId: "660570de5c1a20f6af43b13a",
            products: [
                
                 {
                    id: "65d0331cd7671692a60e8138",
                    quantity: 1
                }
               
            ]
}
POSMAN
{
    "cartId": "660570de5c1a20f6af43b13a",
    "productId": "65d0331cd7671692a60e8138",
    "quantity": 28
}
*/

// Crea un carrito con productos:
router.post('/todo2',handlePolicies(["USER", "PREMIUM"]), cartCtrol.creaCarritoConProductosDesdeLaVista);
router.post('/todo', handlePolicies(["USER", "PREMIUM"]), cartCtrol.creaCarritoConProductos);
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
router.post("/:cid/product/:pid", handlePolicies(["USER", "PREMIUM"]), cartCtrol.updateCart);

/*
Deberá eliminar del carrito el producto seleccionado.
*/
router.delete("/:cid/products/:pid", handlePolicies(["USER", "ADMIN", "PREMIUM"]), cartCtrol.deleteCart);

//////////////////////////////////////////////////

 /* DELETE api/carts/:cid 
  Deberá eliminar todos los productos del carrito */
  router.delete("/:cid", handlePolicies(["USER", "ADMIN", "PREMIUM"]), cartCtrol.deleteAllProductByCartId);
    
 ///////////////////////////////////////////////////////////////

 /* PUT api/carts/:cid 
 Deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.
 */
 router.put('/:cid', cartCtrol.updateCartByProduct); 

 ///////////////////////////////////////////////////////////////

 /* PUT api/carts/:cid/products/:pid
 Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
 Si el producto no existe le agrega el producto con la cantidad, de lo contrario incrementa su cantidad.
 */
 router.put("/:cid/products/:pid", handlePolicies(["USER","PREMIUN","ADMIN"]), cartCtrol.updateQuantity);
   
export default router;