const userModel = require('../dao/model/user.model');
const handlePolicies = require('../middleware/handle-policies.middleware');

getUsers = async(req, res) => {
    try{
        let users = await userModel.find();
        return res.json({message: "Usuarios registrados ", user: users});

    }catch(error){
        console.log("Error, ", error);
    }
}

getUserById = async(req, res) => { 
    try{
        const uId = req.params.userId;

        const userData = await userModel
        .findById({_id: uId})
        
        if(!userData){
           return res.status(404).json({message: "Usuario no encontrado"})
        }

        return res.json({message: "Usuario ", user: userData});

    }catch(error){
        console.log("Error ", error)
    }
}

agregaCartAlUser = async(req, res) => {
    
    try{
      const {userId, cartId} = req.params;
      // BUSCAR USUARIO
      // req.user.id -> hace referencia al usuario que está logueado.
      const datosDelUsuario = await userModel.findById({_id: userId || req.user.id});
  
      // AGREGA EL CARRITO AL ARRAY 
      datosDelUsuario.carts.push({cart:cartId});
  
    //  console.log("Usuario con el carrito => ", datosDelUsuario);
  
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
  }

  deleteUserById = async (req, res) => {

    try {
      const deleteUser = await userModel.deleteOne({ _id: req.params.userId });
      return res.json({
        message: `El Administrador eliminó el usuario.`,
        user: deleteUser,
      });
    } catch (error) {
      console.log("error, ", error);
    }
  };

module.exports = {
    getUsers,
    getUserById,
    agregaCartAlUser,
    deleteUserById
}