const {Router} = require('express');
const passport = require("passport");

const userModel = require('../dao/model/user.model');
const {createHash, isValidPasswd} = require('../utils/encrypt');
const {generateJWT} = require('../utils/jwt');

const checkAuthJwt = require("../middleware/auth-jwt.middleware");

const router = Router();

router.post('/login', async(req, res) => {
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

        const {unaPassword, first_name, last_name, email:emailDb, age, role, carts} = findUser;

        const token = await generateJWT({ first_name, last_name, email:emailDb, age, role, carts});

        return res
        .cookie("cookieToken", token, {
          maxAge: 60*60*1000,
          httpOnly: true, // Para que los datos sean seguros.
        })
        .send({message: "Felicitaciones, te haz logueado correctamente."})
      
    }catch(error){
        console.log("Error de login, ", error);
    } 
})

router.get("/logout", async(req, res) => {
  req.session.destroy(error => {
      if(!error) return res.redirect('/login');
      return res.send({message: "logout error", body: error});
  })
})

router.post("/recover-psw", async (req, res) => {
  try{
      const {new_password, email} = req.body;

// FALTA: Controlar datos nulos

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

  }
})

// FALTA: crear una estrategia local para el registro.
router.post('/register', async(req, res) => {
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
        console.log("Error de registro: ", error);
     }
})

router.get("/current", 
checkAuthJwt("jwt")/*passport.authenticate("jwt", {session:false})*/,
  async (req, res) => {
    //console.log("cookie = ", req.cookies)
    return res.json({message: "jwt en las cookies"})
  }
);

//////////////////////////////////////////////////////////////////

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    try { 
      req.session.user = req.user;

  // FALTA: Controlar datos nulos
     let admin = false;
     if(req.session?.user?.email === "adminCoder@coder.com"){
       admin = true;
     }

     if(admin){
       req.session.user.rol = "admin"
     }else{
       req.session.user.rol = "usuario"
     }

     return res.redirect('/products/?first_name=' + (req.session?.user?.first_name) + '&last_name=' + (req.session?.user?.last_name) + '&email=' + (req.session?.user?.email) + '&age=' + (req.session?.user?.age) + '&rol='+req.session?.user?.rol);
    } catch (error) {
      console.log("Error:", error);
    }
  }
);


module.exports = router;