import userModel from '../model/user.model.js';
import UserDto from '../../dto/User.dto.js';
import CartManager from './CartManager.js';
//import {CartService} from '../../repository/index.js';

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


           let users2= [];
      
            users.forEach(u => {        
              let userDto = new UserDto({
                first_name: u.first_name,
                last_name: u.last_name,
                email: u.email,
                role: u.role, 
              });
              users2.push(userDto);
            }
            );

            return users2;
        }catch(error){
           return null;
        }
    }

    getUserById = async(unId) => { 
        try{  
           let userData = null;
            try{
              userData = await userModel.findById({_id: unId})
            }catch(error){ }
            if(!userData){
               return null;
            }
    
            return userData;
    
        }catch(error){
        }
    }

    getUserByEmail = async(unEmail) => { 
      try{  
         let userData = null;
          try{
            userData = await userModel.findOne({email:unEmail})
            
          }catch(error){ }
          if(!userData){
             return null;
          }
  
          return userData;
  
      }catch(error){
        
      }
  }


  addCartInUserPorVista = async(userId, cartId) => {
    let r = await this.getUserByEmail(userId);
    
    console.log("r en vista " + r._id);
    return await this.addCartInUser(r._id,cartId);
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
      let cartService = new CartManager();
      // Buscar si el carrito fue creado:
     let carritoFueCreado = await cartService.getCartById(cartId); 

     if(!carritoFueCreado){
        return null;      
     }

      console.log("carritoFueCreado = " + carritoFueCreado);

      const carritoExistente = datosDelUsuario.carts.find(cart => cart.cart.toString() === cartId);

      console.log("carrito Existen " + carritoExistente)

      if(carritoExistente){
        console.log("El carrito ya estaba agregado");
        return datosDelUsuario;
      }

      // AGREGA EL CARRITO AL ARRAY 
      datosDelUsuario.carts.push({cart:cartId});
    
      const usuarioActualizado = await userModel.updateOne(
        {_id: userId || req.user.id},
        {$set: {...datosDelUsuario}});
  
  //////////
      console.log("carrito asociado con éxito");
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
      

      deleteUserByEmail = async (userId) => {
        try {
          let deleteUser = null;
          try{
            deleteUser = await userModel.deleteOne({ email: userId });
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

    isCartAssociated = async (cartId) => {
      try {
          const usersWithCart = await userModel.find({ 'carts.cart': cartId });
          return usersWithCart.length > 0;
      } catch (error) {
          console.error("Error al verificar la asociación del carrito: ", error);
          return false;
      }
  }

}