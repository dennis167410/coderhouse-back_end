import userModel from '../dao/model/user.model.js';
import {createHash, isValidPasswd} from '../utils/encrypt.js';
import {generateJWT, verifyTokenJWT} from '../utils/jwt.js';
import UserDto from '../dto/User.dto.js';

const login = async(req, res) => {
    try{
        const {email, password} = req.body;

        const findUser = await userModel.findOne({email});

        if(!findUser){
            return handleResponseLogin(req, res, {message: "Error, usuario no registrado."}, 400);
        }

        const isValidComparePassword = await isValidPasswd(password, findUser.password);

        if(!isValidComparePassword){
         return handleResponseLogin(req, res, {message: "Error, sus credenciales no son válidas."}, 400);    
        }

        findUser.last_connection = new Date();
        await findUser.save();

        const userDto = new UserDto({
          first_name: findUser.first_name,
          email: findUser.email,
          role: findUser.role, 
          carts: findUser.carts
        });

        const token = await generateJWT({userDto});
        req.session.user = userDto.email;
        req.session.role = userDto.role;
        /*return res
        .cookie("cookieToken", token, {
          maxAge: 60*60*1000,
          httpOnly: true, 
        })
        .send({message: "Felicitaciones, te haz logueado correctamente. Levantá el token en las cookies."})
    */

        return handleResponseLogin2(
          req,
          res,
          { message: "Felicitaciones, te haz logueado correctamente. Levantá el token en las cookies." },
          200,
          {
            name: "cookieToken",
            value: token,
            options: {
              maxAge: 60 * 60 * 1000,
              httpOnly: true
            }
          }
        );
      
    }catch(error){
      return handleResponseLogin(req, res, {message: "Error de login."}, 400);
    } 
}

const logout = async(req, res) => {
  const email = req.session.user;

  req.logger.info("email = " + email)
  // Buscar al usuario y actualizar la fecha de la última conexión
  const findUser = await userModel.findOne({ email });
  if (findUser) {
      findUser.last_connection = new Date();
      await findUser.save();
  }

  // Limpiar la cookie
    res.clearCookie('cookieToken');

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

  // Verificar y decodifica el token
  let emailRecibido = await obtenerEmail(token);
      if(!emailRecibido || emailRecibido == null){
        return handleResponseRecover(req, res, {message: "Error, el token expiro. Consulte al administrador."}, 400);          
      }

  req.logger.info("email = "+ email + " luego de la promesa ", emailRecibido);

   if(email === emailRecibido){
    req.logger.info("Los emails coinciden.")
  }else{
    req.logger.error("Los emails no coinciden.");
    return handleResponseLogin(req, res, {message: "Error, los mails no coinciden."}, 400);
  }

  // Obtiene el usuario asociado al token
   const user = await userModel.findOne({email});
   
   if(!user){
      return handleResponseRecover(req, res, {message: "Error, credenciales no son válidas o son erroneas."}, 400);
   }

   const esValido = await isValidPasswd(new_password, user.password)
   if(esValido){
    req.logger.info("Las contraseñas no pueden ser iguales.");
    return res.redirect('/recover/?first_name=' + (req.session?.user?.first_name) + '&last_name=' + (req.session?.user?.last_name) + '&email=' + (req.session?.user?.email) + '&age=' + (req.session?.user?.age) + '&rol='+req.session?.user?.rol);
  }else{
    req.logger.info("Ok.")
  }

  const newPasswdHasheado = await createHash(new_password);

   const updateUser = await userModel.findByIdAndUpdate(user._id, {password: newPasswdHasheado});
        if(!updateUser){
            return handleResponseRecover(req, res, {message: "Error, al intentar actualizar la contraseña."}, 404);
          }
 
        return res.render("login");
  
    }catch(error){
        req.logger.error("Error, ", error);
    }   
}

const register = async(req, res) => {
   /*
{
  POSMAN
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

    req.logger.info(first_name + " " + last_name + " " + email + " " +age + " " +password +" " + role);

    if(!email){
      return handleResponse(req, res, {message: "Error, al intentar registrar el usuario, existen datos nulos o vacíos."}, 400);
    }

    if(!email){
       return handleResponse(req, res, {message: "Error, al intentar registrar el usuario, existen datos nulos o vacíos."}, 400);
     }

    //Controla que el mail no exista en la base de datos.
    const user = await userModel.findOne({email});
    if(user){
      return handleResponse(req, res, {message: "Error, existe un usuario con ese email."}, 404);
    
    }

    let last_connection = new Date();
    const newUser = await userModel.create({
      first_name, 
      last_name, 
      email, 
      age, 
      role,
      last_connection,
      password: passHasheado
    });

    if(!newUser){
      return handleResponse(req, res, {message: "Error al intentar registrar el usuario. Datos nulos o vacíos."}, 400);
    }
   
    return handleResponse(req, res, {message: "Usuario registrado correctamente", user:newUser}, 200);

   }catch(error){
      return handleResponse(req, res, {message: "Error al intentar registrar el usuario. Datos nulos o vacíos."}, 400);
   }
}

// Manejadores de respuestas
const handleResponse = (req, res, response, statusCode) => {
  if (req.headers['content-type'] === 'application/json' || req.xhr) {
      return res.status(statusCode).json(response);
  } else {
      return res.status(statusCode).render('register', response);
  }
};

const handleResponseLogin = (req, res, response, statusCode) => {
  if (req.headers['content-type'] === 'application/json' || req.xhr) {
      return res.status(statusCode).json(response);
  } else {
      return res.status(statusCode).render('login', response);
  }
};

const handleResponseLogin2 = (req, res, response, statusCode, cookieOptions = null) => {
  if (cookieOptions) {
    res.cookie(cookieOptions.name, cookieOptions.value, cookieOptions.options);
  }

  if (req.headers['content-type'] === 'application/json' || req.xhr) {
    return res.status(statusCode).json(response);
  } else {
    return res
    .status(200)
    .redirect('/products/?first_name=' + ( req.session.user) + '&rol=' + (req.session.role));
   }
};

const handleResponseRecover = (req, res, response, statusCode) => {
  if (req.headers['content-type'] === 'application/json' || req.xhr) {
      return res.status(statusCode).json(response);
  } else {
      return res.status(statusCode).render('recover', response);
  }

};


export default {
  login, 
  logout,
  recoverPasswd2,
  register,
}

