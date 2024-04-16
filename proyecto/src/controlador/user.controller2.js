//import userModel from '../dao/model/user.model.js';

/*const getUsers = async(req, res) => {
    try{
        let users = await userModel.find();
        return res.json({message: "Usuarios registrados ", user: users});

    }catch(error){
        console.log("Error, ", error);
    }
}*/

/*const getUserById = async(req, res) => { 
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
}*/

/*const agregaCartAlUser = async(req, res) => {
    
    try{
      const {userId, cartId} = req.params;
      // BUSCAR USUARIO
      // req.user.id -> hace referencia al usuario que está logueado.
      const datosDelUsuario = await userModel.findById({_id: userId || req.user.id});
  
      // AGREGA EL CARRITO AL ARRAY 
      datosDelUsuario.carts.push({cart:cartId});
    
      const usuarioActualizado = await userModel.updateOne(
        {_id: userId || req.user.id},
        {$set: {...datosDelUsuario}});
  
  //////////
      return res.json({
        message: "Se agregó corretamente el carrito al usuario.",
        user: usuarioActualizado
      })
  
    }catch(error){
      console.log("Erro al intentar agregar el carrito al usuario. ", error);
    }
  }
*/
/*
  const deleteUserById = async (req, res) => {

    try {
      const deleteUser = await userModel.deleteOne({ _id: req.params.userId });
      return res.json({
        message: `El Administrador eliminó el usuario.`,
        user: deleteUser,
      });
    } catch (error) {
      console.log("error, ", error);
    }
  };*/

/*export default {
  getUsers,
  getUserById,
  agregaCartAlUser,
  deleteUserById
}*/