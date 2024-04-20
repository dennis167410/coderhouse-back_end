
import {Router} from 'express';
import handlePolicies from '../middleware/handle-policies.middleware.js';
import UserCtrol from '../controlador/user.controller.js';

const userCtrol = new UserCtrol();

const router = Router();

router.get('/', handlePolicies(["PUBLIC"]), userCtrol.getUsers)

router.get('/:userId', handlePolicies(['USER', 'ADMIN']), userCtrol.getUserById);

// Agregar carrito al usuario
router.post('/:userId/carts/:cartId', handlePolicies(['USER', 'ADMIN']), userCtrol.addCartInUser);

//Elimina el usuario.
router.delete("/:userId", handlePolicies(["ADMIN"]), userCtrol.deleteUserById);

export default router;