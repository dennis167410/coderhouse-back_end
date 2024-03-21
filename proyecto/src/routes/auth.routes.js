const {Router} = require('express');

const userModel = require('../dao/model/user.model');
const {createHash, isValidPasswd} = require('../utils/encrypt');
const {generateJWT} = require('../utils/jwt');

const router = Router();

router.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body;

        //FALTA VALIDAR email y password.

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

        const {unaPassword, first_name, last_name, email:emailDb, age, role, carts} = findUser;

        const token = await generateJWT({ first_name, last_name, email:emailDb, age, role, carts});

        return res.json({message: `Bienvenido\a ${email}, login exitoso, `, token})

    }catch(error){
        console.log("Error de login, ", error);
    } 
})


// FALTA: crear una estrategia local para el registro.
router.post('/register', async(req, res) => {
     try{
      const {first_name, last_name, email, age, password, role} = req.body;

      //FALTA Validar todos los campos del body:

      const passHasheado = await createHash(password);

      // Controlar que los mails no se repita.
      
      const newUser = await userModel.create({
        first_name, 
        last_name, 
        email, 
        age, 
        role,
        password: passHasheado
      });

      // FALTA: validar que se creo correctamete el usuario.
      if(!newUser){
        // Manejar el error, puede ser 400 0 500.
      }

      return res.json({
        message: "Usuario creado correctamente.",
        user: newUser
      });

     }catch(error){
        console.log("Error de registro: ", error);
     }
})

module.exports = router;