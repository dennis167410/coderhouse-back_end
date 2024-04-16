
import {UserService} from '../repository/index.js';

export default class UserController{
    userService;

    constructor(){
        this.userService = UserService;
    }


    getUsers = async(req, res) => {
        try{
            let users = await this.userService.getUsers();
            return res.json({message: "Usuarios registrados ", user: users});
    
        }catch(error){
            console.log("Error, ", error);
        }
    }


    getUserById = async(req, res) => { 
        try{
            const uId = req.params.userId;
    
            const userData = await this.userService.getUserById(uId);
            
            if(!userData || userData === null){
               return res.status(404).json({message: "Usuario no encontrado"})
            }
    
            return res.json({message: "Usuario ", user: userData});
    
        }catch(error){
            console.log("Error ", error)
        }
    }

    addCartInUser = async(req, res) => {    
        try{
          const {userId, cartId} = req.params;
         
          const user = await this.userService.addCartInUser(userId || req.user.id, cartId);
      
          if(!user || user === null){
            return res.status(404).json({message: "Error, no se pudo agregar el carrito al usuario."})
         }
      
      //////////
          return res.json({
            message: "Se agregó correctamente el carrito al usuario.",
            user: user
          })
      
        }catch(error){
          console.log("Erro al intentar agregar el carrito al usuario. ", error);
        }
      }

    deleteUserById = async (req, res) => {

        try {
          const deleteUser = await this.userService.deleteUserById(req.params.userId);
         
          if(!deleteUser || deleteUser === null){
            return res.status(404).json({message: "Error, no se pudo eliminar el usuario."})
         }
         
          return res.json({
            message: `El Administrador eliminó el usuario.`,
            user: deleteUser,
          });
        } catch (error) {
          console.log("error, ", error);
        }
      };

}