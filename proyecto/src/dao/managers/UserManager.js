import userModel from '../model/user.model.js';

export default class UserManager {
    constructor(dao){
        this.dao = dao; 
    }

    addUser = async (usersData) => {
        try{
            let newUser = await userModel.create({usersData});
            return newUser;
        }catch(error){
           return error;
        }
    }

    getUsers = async() => {
        try{
            let users = await userModel.find();
            return users;
        }catch(error){
           return null;
        }
    }

    getUserById = async(unId) => { 
        try{  
           let userData = null;
            try{
              userData = await userModel.findById({_id: unId})
              console.log(userData)
            }catch(error){ }
            if(!userData){
               return null;
            }
    
            return userData;
    
        }catch(error){
        }
    }

    addCartInUser = async(userId, cartId) => {
    
        try{
          // BUSCAR USUARIO
          let datosDelUsuario = null;
          try{
          datosDelUsuario = await userModel.findById({_id: userId});
          }catch(error){
            return null;
          }
          // AGREGA EL CARRITO AL ARRAY 
          datosDelUsuario.carts.push({cart:cartId});
        
          const usuarioActualizado = await userModel.updateOne(
            {_id: userId || req.user.id},
            {$set: {...datosDelUsuario}});
      
      //////////
          return usuarioActualizado
          
        }catch(error){
          console.log("Error al intentar agregar el carrito al usuario. ", error);
          return null;
        }
      }

      deleteUserById = async (userId) => {
        try {

          let deleteUser = null;
          try{
            deleteUser = await userModel.deleteOne({ _id: userId });
          }catch(error){
            return null;
          }
          
          return deleteUser
          } catch (error) {
            return null;
        }
      };
      
      getUserEmailByCartId = async (cartId) => {
        try {
          let user = null;
          console.log(cartId)
          try{
            user = await userModel.findOne({ 'carts.cart': cartId });
          }catch(error){
            return null;
          }          
          console.log(user)  

          if (!user) {
                return null;
            }
    
            // Obtener el email del usuario
            const userEmail = user.email;
            return userEmail;
        } catch (error) {
            return null;
        }
    };

}