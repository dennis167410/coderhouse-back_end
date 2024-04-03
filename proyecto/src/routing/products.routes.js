const {Router} = require('express');
//const productData = require('../base_de_datos/products.js')
// const ProductManager = require ('../dao/managers/ProductManager.js');
const productCtrl = require('../controlador/product.controller.js');

const router = Router();

router.post('/', productCtrl.createProduct);

// Ejemplo: http://localhost:8080/api/products?limit=5
// http://localhost:8080/api/products/?limit=5&sort=asc
// http://localhost:8080/api/products?limit=5&page=2&sort=desc&query=find
router.get('/', productCtrl.getAllProducts);

/////////////////////////////////////////////////////////////

// localhost:8080/api/products/65ceb99486869118617b2cef
router.get("/:pid", productCtrl.getProductById);

// localhost:8080/api/products/cat1
router.get("/category/:category", productCtrl.productsByCategory);

router.get("/disponibilidad/:disponibilidad", productCtrl.productsByDispo);

// localhost:8080/api/products/65ceb99486869118617b2cef
router.delete("/:pid", productCtrl.deleteProductById);

router.put('/:pid', productCtrl.updateProduct);


module.exports = router;
