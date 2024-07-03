import { Router } from "express";
import { generateProduct } from "../mocking/products.mocking.js";
import { generateCart } from "../mocking/carts.mocking.js";
import {DictionaryErrors, HttpResponse} from '../middleware/error/error.manejador.js';

import CustomError from "../middleware/error/CustomError.js";
import { generateProductsErrorInfo } from "../middleware/error/info.js";

const router = Router();

const httpResponse = new HttpResponse;
const MAX_PRODUCTS = 100;
let products = [];


router.get("/", async (req, res) => {
 
  for (let index = 0; index < MAX_PRODUCTS; index++) {
    products.push(generateProduct());
  }
  return httpResponse.OK(res, `Productos generados con éxito.`, products)
  
}); 


router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
  
    if (!pid || isNaN(pid) || pid < 0) {
      return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Parámetros no son válidos para productId`
      );
}

    const product = generateProduct();
    return httpResponse.OK(res, `Generadoo el producto...`,
      product);
  });


router.post("/", async (req, res) => {
    try {
      const { title, description, code, price, stock=0, category } = req.body;

      if((price && isNaN(price)) || (stock && isNaN(stock))){
        return httpResponse.BadRequest(res, `${DictionaryErrors.ERROR_DE_TIPOS_NO_VALIDOS}`);
      }

      let p = Number(price)
      let s = Number(stock)
      if (!title || !description || !code || !price || p<0 || !stock || s <0 || !category) {
        /* EXPLOTA:
             CustomError.createError({
            name: "Product creation error",
            cause: generateProductsErrorInfo(title, description, code, price, stock, category),
            message: "Error al intentar crear el producto.",
            code: DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS          
        })*/
        let causa = generateProductsErrorInfo(title, description, code, p, s, category);
        return httpResponse.BadRequest(res, `Datos nulos o vacíos en el body.`, {message: causa});
      }
        const product = {
            title:title, description:description, code:code, price:price, stock:stock, category:category
        }  
        if(products.length ===0){
            product.id = 1;
        }else{
            product.id = products[products.length-1].id+1;
        }
        products.push(product);
        return httpResponse.OK(res, `Producto de título `, { title: `${title} fue creado.`, product});
       
  } catch (error) {
    req.logger.error(`Error `, error);
    
  }
});


router.get("/category/:category", async (req, res) => {
    const { category} = req.params;
    if (!category || !isNaN(category)) {
      return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Los parámetros para la categoría no son válidos.`
      );
}  
for (let index = 0; index < MAX_PRODUCTS; index++) {
    products.push(generateProduct());
  }
  
  let categories = products.filter((p) => p.category === category) 

return httpResponse.OK(res, `Productos en la categoría = ${category} `,
  categories);
});



router.get("/disponibilidad/:disponibilidad", async (req, res) => {
    const {disponibilidad} = req.params;
    if (!disponibilidad || isNaN(disponibilidad) || disponibilidad < 0) {
      return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Los parámetros para la disponibilidad no son válidos.`
      );
}  

for (let index = 0; index < MAX_PRODUCTS; index++) {
    products.push(generateProduct());
  }
  
    let disponi = products.filter((p) => p.stock >= disponibilidad) 

    return httpResponse.OK(res, `Productos con stock mayor o igual a  ${disponibilidad}`, {
      disponi
    });
  });


router.delete("/:pid", async (req, res) => {
    const {pid} = req.params;
    if (!pid || isNaN(pid) || pid < 0) {
      return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Los parámetros para el producto no son válidos.`
      );
}  

    for (let index = 0; index < MAX_PRODUCTS; index++) {
        products.push(generateProduct());
    }
  
    let eliminado = products.find((p) => Number(p.id) == Number(pid)) 

    return httpResponse.OK(res, `Producto ${pid} fue dado de baja.`, {eliminado});
})

router.put("/:pid", async (req, res) => {
    const {pid} = req.params;

  if (!pid || isNaN(pid) || pid < 0) {
    return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Los parámetros para el producto no son válidos.`
      );
  }  
    return httpResponse.OK(res, `Producto ${pid} fue actualizado.`);
})


let carts = [];

/* Agrega el producto al arreglo “products” del carrito seleccionado. */
router.post("/:cid/product/:pid", async (req, res) => {
    const {cid, pid} = req.params;
    const {quantity} = req.body;

   if (!cid || isNaN(cid) || cid < 0 || !pid || isNaN(pid) || pid < 0 || !quantity || quantity < 0) {
    return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Los parámetros para el carrito no son válidos.`
      );
} 

const cart = {
    id: cid,
    products: [{id: pid, quantity:quantity}]
}  
    return httpResponse.OK(res, `Producto agregado con éxito al carrito.`, cart)
  }); 


router.put("/:cid/product/:pid", async (req, res) => {
    const cid =  req.params.cid;
    const pid =  req.params.pid;

    const product = req.body;

    const quantity = product.quantity;

   if (!cid || isNaN(cid) || cid < 0 || !pid || isNaN(pid) || pid < 0 || !quantity || quantity < 0) {
    return httpResponse.BadRequest(
        res,
        `${DictionaryErrors.ERROR_PARAMETROS_NO_VALIDOS} - Los parámetros para el carrito no son válidos.`
      );
}

for (let index = 0; index < 10; index++) {
    carts.push(generateCart());
}

carts.forEach((c) => {
   if(Number(c.id) == Number(cid)){
    c.product.quantity += quantity;
    }
}
) 
    return httpResponse.OK(res, `Cantidad de productos fue actualizada con éxito en el carrito.`)
  }); 

export default router;
