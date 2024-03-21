const {Router} = require('express');

const userModel = require('../dao/model/user.model');
const handlePolicies = require('../middleware/handle-policies.middleware');

const router = Router();

router.get('/', handlePolicies(["PUBLIC"]), async(req, res) => {
    try{
        let users = await userModel.find();
        return res.json({message: "Usuarios registrados ", user: users});

    }catch(error){
        console.log("Error, ", error);
    }
})

router.get('/:userId', handlePolicies(['USER', 'ADMIN']), async(req, res) => { 
    try{
        const uId = req.params.userId;

        const userData = await userModel
        .findById({_id: uId})
        
        //console.log("userData = ", userData)

        if(!userData){
//            console.log("No encontrado")
            return res.status(404).json({message: "Usuario no encontrado"})
        }

        return res.json({message: "Usuario ", user: userData});

    }catch(error){
        console.log("Error ", error)
    }

})

// Agregar carrito al usuario
router.post('/:userId/carts/:cartId', handlePolicies(['USER', 'ADMIN']), async(req, res) => {
    
  try{

    const {userId, cartId} = req.params;

//console.log(" req.user._id = ",  req.user.id)
    // BUSCAR USUARIO

    // req.user.id -> hace referencia al usuario que está logueado.
    const datosDelUsuario = await userModel.findById({_id: userId || req.user.id});

    // AGREGA EL CARRITO AL ARRAY 
    datosDelUsuario.carts.push({cart:cartId});

    console.log("Usuario con el carrito => ", datosDelUsuario);

    //const usuarioActualizado = await userModel.updateOne({_id: userId, datosDelUsuario});

    const usuarioActualizado = await userModel.updateOne(
      {_id: userId || req.user.id},
      {$set: {...datosDelUsuario}});


//////////
/*await userModel.updateOne(
  {_id: userId},
  {$set: {...datosDelUsuario}}
  )
return await userModel.findById(userId)
*/
//////////
    return res.json({
      message: "Se agregó corretamente el carrito al usuario.",
      user: usuarioActualizado
    })

  }catch(error){
    console.log("Erro al intentar agregar el carrito al usuario. ", error);
  }
})

router.delete("/:userId", handlePolicies(["ADMIN"]), async (req, res) => {
    /* console.log(
      "ADMIN",
    //  req.user
    ); */
    try {

     //console.log("req.params.userId = ", req.params.userId)
      const deleteUser = await userModel.deleteOne({ _id: req.params.userId });

      return res.json({
        message: `El Administrador eliminó el usuario.`,
        user: deleteUser,
      });
    } catch (error) {
      console.log("error, ", error);
    }
  });

module.exports = router;