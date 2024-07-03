import {Router} from 'express';
import ProductCtrl from '../controlador/product.controller.js';
import handlePolicies from '../middleware/handle-policies.middleware.js';

const productCtrl = new ProductCtrl();

const router = Router();

router.post('/', handlePolicies(['PREMIUM', 'ADMIN']), productCtrl.createProduct);

// Ejemplo: http://localhost:8080/api/products?limit=5
// http://localhost:8080/api/products/?limit=5&sort=asc
// http://localhost:8080/api/products?limit=5&page=2&sort=desc&query=find
router.get('/', productCtrl.getAllProducts);

// localhost:8080/api/products/65ceb99486869118617b2cef
router.get("/:pid", productCtrl.getProductById);

// localhost:8080/api/products/cat1
router.get("/category/:category", productCtrl.productsByCategory);

router.get("/disponibilidad/:disponibilidad", productCtrl.productsByDispo);

// localhost:8080/api/products/65ceb99486869118617b2cef
router.delete("/:pid", handlePolicies(["ADMIN", "PREMIUM"]), productCtrl.deleteProductById);

router.put('/:pid', handlePolicies(["ADMIN", "PREMIUM"]), productCtrl.updateProduct);

export default router;
