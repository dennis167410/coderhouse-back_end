import {Router} from 'express';
import handlePolicies from '../middleware/handle-policies.middleware.js';
import UserCtrol from '../controlador/user.controller.js';

const userCtrol = new UserCtrol();

const router = Router();

router.get('/', userCtrol.getUsers)

router.get('/:userId', handlePolicies(['USER', 'ADMIN']), userCtrol.getUserById);

// Agregar carrito al usuario
router.post('/:userId/carts/:cartId', handlePolicies(['USER', 'ADMIN']), userCtrol.addCartInUser);

//Elimina el usuario.
router.delete("/:userId", handlePolicies(["ADMIN"]), userCtrol.deleteUserById);
//Por la vista:
router.delete("/elimina/:email", userCtrol.deleteUserByEmail);

/* Permite cambiar el rol de un usuario, de "user" a "premium" y viceversa. */
//Por POSTMAN
router.post("/premium/:uid", handlePolicies(['USER', 'ADMIN', "PREMIUM"]), userCtrol.updateUserRole);
// Por la vista:
router.post("/premiumm/:uid", handlePolicies(['USER', 'ADMIN', "PREMIUM"]), userCtrol.updateUserRolePorEmail);

export default router;