
import {Router} from 'express';
import handlePolicies from '../middleware/handle-policies.middleware.js';
import userCtrol from '../controlador/user.controller.js';


const router = Router();

router.get('/', handlePolicies(["PUBLIC"]), userCtrol.getUsers)

router.get('/:userId', handlePolicies(['USER', 'ADMIN']), userCtrol.getUserById);

// Agregar carrito al usuario
router.post('/:userId/carts/:cartId', handlePolicies(['USER', 'ADMIN']), userCtrol.agregaCartAlUser);

//Elimina el usuario.
router.delete("/:userId", handlePolicies(["ADMIN"]), userCtrol.deleteUserById);

export default router;