const {Router} = require('express');

const handlePolicies = require('../middleware/handle-policies.middleware');
const userCtrol = require('../controlador/user.controller');

const router = Router();

router.get('/', handlePolicies(["PUBLIC"]), userCtrol.getUsers)

router.get('/:userId', handlePolicies(['USER', 'ADMIN']), userCtrol.getUserById);

// Agregar carrito al usuario
router.post('/:userId/carts/:cartId', handlePolicies(['USER', 'ADMIN']), userCtrol.agregaCartAlUser);

//Elimina el usuario.
router.delete("/:userId", handlePolicies(["ADMIN"]), userCtrol.deleteUserById);

module.exports = router;