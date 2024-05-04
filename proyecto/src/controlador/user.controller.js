
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
          req.logger.error("Error: ", error);
        }
    }


    getUserById = async(req, res) => { 
        try{
            const uId = req.params.userId;
    
            const userData = await this.userService.getUserById(uId);
    
           
            if(!userData || userData === null){
               req.logger.error("Error usuario no encontrado o el formato del id no es válido.");
               return res.status(404).json({message: "Usuario no encontrado o formato del id no es válido."})
            }
    
            return res.json({message: "Usuario ", user: userData});
    
        }catch(error){
            req.logger.error("Error: ", error);
        }
    }

    addCartInUser = async(req, res) => {    
        try{
          const {userId, cartId} = req.params;
         
          const user = await this.userService.addCartInUser(userId || req.user.id, cartId);
      
          if(!user || user === null){
            req.logger.error("Error, no se pudo agregar el carrito al usuario.");
            return res.status(404).json({message: "Error, no se pudo agregar el carrito al usuario."})
         }
      
      //////////
          return res.json({
            message: "Se agregó correctamente el carrito al usuario.",
            user: user
          })
      
        }catch(error){
          req.logger.error("Error al intentar agregar el carrito al usuario. ", error);
        }
      }

    deleteUserById = async (req, res) => {

        try {
          const deleteUser = await this.userService.deleteUserById(req.params.userId);
         
          if(!deleteUser || deleteUser === null){
            req.logger.error("Error al intentar eliminar el usuario. ");
            return res.status(404).json({message: "Error, no se pudo eliminar el usuario."})
         }
         
          return res.json({
            message: `El Administrador eliminó el usuario.`,
            user: deleteUser,
          });
        } catch (error) {
          req.logger.error("Error ", error);
        }
      };
}