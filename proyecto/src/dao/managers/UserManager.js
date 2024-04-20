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
            console.log("Error: ", error);
        }
    }

    getUsers = async() => {
        try{
            let users = await userModel.find();
            return users;
        }catch(error){
            console.log("Error, ", error);
        }
    }

    getUserById = async(unId) => { 
        try{  
            const userData = await userModel.findById({_id: unId})
            
            if(!userData){
               return null;
            }
    
            return userData;
    
        }catch(error){
            console.log("Error ", error)
        }
    }

    addCartInUser = async(userId, cartId) => {
    
        try{
          // BUSCAR USUARIO
         const datosDelUsuario = await userModel.findById({_id: userId});
      
          // AGREGA EL CARRITO AL ARRAY 
          datosDelUsuario.carts.push({cart:cartId});
        
          const usuarioActualizado = await userModel.updateOne(
            {_id: userId || req.user.id},
            {$set: {...datosDelUsuario}});
      
      //////////
          return usuarioActualizado
          
        }catch(error){
          console.log("Error al intentar agregar el carrito al usuario. ", error);
        }
      }

      deleteUserById = async (userId) => {
        try {
          const deleteUser = await userModel.deleteOne({ _id: userId });
          return deleteUser
          } catch (error) {
          console.log("error, ", error);
        }
      };
      
      getUserEmailByCartId = async (cartId) => {
        try {
            const user = await userModel.findOne({ 'carts.cart': cartId });
                        
            if (!user) {
                return null;
            }
    
            // Obtener el email del usuario
            const userEmail = user.email;
            return userEmail;
        } catch (error) {
            console.error('Error al obtener el email del usuario:', error);
            throw error;
        }
    };

}