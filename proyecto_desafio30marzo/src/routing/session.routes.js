const {Router} = require('express');
const passport = require("passport");
const sessionCtrol = require('../controlador/session.controller');
const checkAuthJwt = require("../middleware/auth-jwt.middleware");
const router = Router();

router.post('/login', sessionCtrol.login);

router.get("/logout", sessionCtrol.logout);

router.post("/recover-psw", sessionCtrol.recoverPasswd);

// FALTA: crear una estrategia local para el registro.
router.post('/register', sessionCtrol.register);
/*
{
    "first_name": "Juan",
    "last_name": "Carnero",
    "email": "jcarnero@gmail.com",
    "age": 43,
    "password": "12345",
    "role": "USER"
}
*/

// Agregar el Bearer token que me da la cookie del login
//router.get("/current", checkAuthJwt("jwt"), sessionCtrol.getCurrent);
router.get("/current", checkAuthJwt("jwt"),
  async (req, res) => {
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