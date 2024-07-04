
import {UserService} from '../repository/index.js';

export default class UserController{
    userService;

    constructor(){
        this.userService = UserService;
    }

    getUsers = async(req, res) => {
        try{
            let users = await this.userService.getUsers();

       // return res.json({message: "Usuarios ", users: users});
        return this.handleResponse(req, res, {message: "Usuarios registrados", users}, 200);
        }catch(error){
          req.logger.error("Error: ", error);
        }
    }


    getUserById = async(req, res) => { 
        try{
            const uId = req.params.userId;         
            const userData = await this.userService.getUserById(uId);
    
            req.logger.info(userData)
              
            if(!userData || userData === null){
               req.logger.error("Error usuario no encontrado o el formato del id no es válido.");
               return res.status(404).json({message: "Usuario no encontrado o formato del id no es válido."})
            }

            return this.handleResponse(req, res, {user:userData}, 200);
          
        }catch(error){
            req.logger.error("Error: ", error);
        }
    }

    addCartInUser = async(req, res) => {    
        try{
          const {userId, cartId} = req.params;
          console.log("en user.controler user = " + userId + " cart = " + cartId)

          const user = await this.userService.addCartInUser(userId || req.user.id, cartId);
      
         /* if(!user || user === null){
            req.logger.error("Error, no se pudo agregar el carrito al usuario.");
            return res.status(404).json({message: "Error, no se pudo agregar el carrito al usuario."})
         }*/
      
         if (!user) {
          req.logger.error("Error, no se pudo agregar el carrito al usuario.");
          return res.status(404).json({ message: "Error, no se pudo agregar el carrito al usuario." });
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

      deleteUserByEmail = async (req, res) => {
        try {
          const deleteUser = await this.userService.deleteUserByEmail(req.params.email);
         
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

      updateUserRole = async (req, res) => {
        try {
          
          const uid = req.params.uid;
          const { role } = req.body;
    
          req.logger.info(uid)
          req.logger.info(role)

            const user = await this.userService.getUserById(uid);
    
            req.logger.info(user)
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }
    
            // Verificar si el nuevo rol es válido
            if (role !== "USER" && role !== "PREMIUM") {
                return res.status(400).json({ message: 'Error, rol no es válido' });
    
            }
            
            // Actualizar el rol del usuario
            user.role = role;
            await user.save();
    
            return res.status(200).json({ message: 'Rol actualizado exitosamente', user });
        } catch (error) {
            req.logger.error('Error al intentar cambiar el rol del usuario:', error);
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
      };


      
      updateUserRolePorEmail = async (req, res) => {
        try {
            const uid = req.params.uid;
            const { role } = req.body;

           const user = await this.userService.getUserByEmail(uid);
    
            if (!user) {
               // return res.status(404).json({ message: 'Usuario no encontrado' });
               return this.handleResponse(req, res, {message: "Usuario no encontrado."}, 400);
            }
    
           
            // Verificar si el nuevo rol es válido
            if (role !== "USER" && role !== "PREMIUM") {
               // return res.status(400).json({ message: 'Rol no válido' });
               return this.handleResponse(req, res, {message: "Rol no válido."}, 400);
            }
    
            // Actualizar el rol del usuario
            user.role = role;
            await user.save();
            return this.handleResponse(req, res, {message: "Rol actualizado correctamente.", user}, 200);
      
      //      return res.status(200).json({ message: 'Rol actualizado exitosamente', user });
        } catch (error) {
            req.logger.error('Error al intentar cambiar el rol del usuario:', error);
           // return res.status(500).json({ message: 'Error interno del servidor' });
           return this.handleResponse(req, res, {message: "Error interno del servidor... ", error}, 500);
        }
      };

      handleResponse = (req, res, response, statusCode) => {
        if (req.headers['content-type'] === 'application/json' || req.xhr) {
            return res.status(statusCode).json(response);
        } else {
            return res.status(statusCode).render('users', response);
        }
      };
}

