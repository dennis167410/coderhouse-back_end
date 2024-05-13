import userModel from '../dao/model/user.model.js';
import {createHash, isValidPasswd} from '../utils/encrypt.js';
import {generateJWT, verifyTokenJWT} from '../utils/jwt.js';
import UserDto from '../dto/User.dto.js';

const login = async(req, res) => {
    try{
        const {email, password} = req.body;

        const findUser = await userModel.findOne({email});

        if(!findUser){
            return res
            .status(400)
            .json({message: "Usuario no registrado."});
        }

        const isValidComparePassword = await isValidPasswd(password, findUser.password);

        if(!isValidComparePassword){
            return res.status(400).json({message: "Credenciales no son válidas."});
        }

        const userDto = new UserDto({
          first_name: findUser.first_name,
          email: findUser.email,
          role: findUser.role, 
          carts: findUser.carts
        });

        const token = await generateJWT({userDto});
        req.session.user = userDto.email;
        req.session.role = userDto.role;
        return res
        .cookie("cookieToken", token, {
          maxAge: 60*60*1000,
          httpOnly: true, // Para que los datos sean seguros.
        })
        .send({message: "Felicitaciones, te haz logueado correctamente. Levantá el token en las cookies."})
              
    }catch(error){
        console.log("Error de login, ", error);
    } 
}

const logout = async(req, res) => {
    req.session.destroy(error => {
        if(!error) return res.redirect('/login');
        return res.send({message: "logout error", body: error});
    })
}

async function obtenerEmail(token) {
  try {
    const decoded = await verifyTokenJWT(token);
    const email = decoded.user.email;
    return email;
  } catch (error) {
      return null;
  }
}

const recoverPasswd2 = async(req, res) => {
    try{
      const {new_password, email, token} = req.body;
   /*   req.logger.info("token recibido en newPasswd ", new_password)
      req.logger.info("token recibido en email ", email)
      req.logger.info("token recibido en el token ", token)*/

  // Verificar y decodifica el token
  let emailRecibido = await obtenerEmail(token);
      if(!emailRecibido || emailRecibido == null){
        return res
        .status(401)
        .json({message: "Error, el token expiro. Consulte con el administrador."});     
      }

  req.logger.info("email = "+ email + " luego de la promesa ", emailRecibido);

   if(email === emailRecibido){
    req.logger.info("Los emails coinciden.")
  }else{
    req.logger.error("Los emails no coinciden.");
    return res
    .status(401)
    .json({message: "Error, los emails no coinciden."});
  }

  // Obtiene el usuario asociado al token
   const user = await userModel.findOne({email});
   
   if(!user){
      return res
      .status(401)
      .json({message: "Las credenciales no son válidas o son erroneas."});
   }

   const esValido = await isValidPasswd(new_password, user.password)
   if(esValido){
    req.logger.info("Las contraseñas no pueden ser iguales.");
    return res.redirect('/recover');
  }else{
    req.logger.info("Ok.")
  }

  const newPasswdHasheado = await createHash(new_password);

   const updateUser = await userModel.findByIdAndUpdate(user._id, {password: newPasswdHasheado});
        if(!updateUser){
            return res.json({message: "Problemas al actualizar la contraseña."})
        }

        return res.render("login");
  
    }catch(error){
        req.logger.error("Error, ", error);
    }   
}

/*
const recoverPasswd = async(req, res) => {
    try{
  
      const {new_password, email} = req.body;
        const newPasswdHasheado = await createHash(new_password);
        const user = await userModel.findOne({email});
  
        if(!user){
            return res
            .status(401)
            .json({message: "Las credenciales no son válidas o son erroneas."});
        }
  
        const updateUser = await userModel.findByIdAndUpdate(user._id, {password: newPasswdHasheado});
        if(!updateUser){
            return res.json({message: "Problemas al actualizar la contraseña."})
        }
  
        return res.render("login");
  
    }catch(error){
        req.logger.error("Error, ", error);
    }   
}
*/

const register = async(req, res) => {
   /*
{
    "first_name": "Pepe",
    "last_name": "Salmon",
    "email": "psalmon@yahoo.com",
    "age": 67,
    "password": "12345",
    "role": "USER"
}
*/
  try{
    const {first_name, last_name, email, age, password, role} = req.body;

    const passHasheado = await createHash(password);

    if(!email){
      return res
      .status(500)
      .json({message: "Error al intentar registrar el usuario. Datos nullos o vacíos."});
    }

    //Controla que el mail no exista en la base de datos.
    const user = await userModel.findOne({email});
    if(user){
      return res
      .status(404)
      .json({message: "Error, existe un usuario con ese email."});
    }

    const newUser = await userModel.create({
      first_name, 
      last_name, 
      email, 
      age, 
      role,
      password: passHasheado
    });

    if(!newUser){
      return res
      .status(500)
      .json({message: "Error al intentar registrar el usuario. Datos nullos o vacíos."});
    }

    //res.session.user = {email, role, id: newUser._id}
    return res.json({
      message: "Usuario creado correctamente.",
      user: newUser
    });

   }catch(error){
      req.logger.error("Error de registro: ", error);
   }
}

export default {
  login, 
  logout,
  recoverPasswd2,
  register,
}

