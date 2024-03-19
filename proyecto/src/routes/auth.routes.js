const {Router} = require('express');

const userModel = require('../dao/model/user.model');
const {createHash, isValidPasswd} = require('../utils/encrypt');
const {generateJWT} = require('../utils/jwt');

const router = Router();

router.post('/login', async(req, res) => {

})

router.post('/register', async(req, res) => {
     try{
      const {first_name, last_name, email, age, password, role} = req.body;

      //FALTA Validar todos los campos del body:

      const passHasheado = await createHash(password);

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
        console.log("Error: ", error);
     }
})

module.exports = router;