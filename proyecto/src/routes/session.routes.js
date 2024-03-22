const {Router} = require("express");
const passport = require("passport");

const userModel = require("../dao/model/user.model");
const {createHash, isValidPasswd} = require("../utils/encrypt"); 
const checkAuthJwt = require("../middleware/auth-jwt.middleware");

const router = Router();


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
       // console.log("GITHUB = " , req.user)

// FALTA: Controlar datos nulos
       console.log("USUARIO = ", req.session.user.email)
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
        console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
      }
    }
  );

router.post("/register", async(req, res) => {
    try{
        console.log("SESSION")
        const {first_name, last_name, email, age, password} = req.body;

        // FALTA: Controlar datos nulos


        const passwordHasheado = await createHash(password);

        const addUser = {
            first_name, 
            last_name, 
            email, 
            age, 
            password: passwordHasheado,
        }; 

        const newUser = await userModel.create(addUser);

        if(!newUser) {
        return res
        .status(500)
        .json({message: "Error al intentar crear el usuario."})
        }

        // Session del usuario:
        req.session.user = {email, firstName: first_name, lastName: last_name}
        return res.redirect('/login');

    }catch(error){
        console.log("Error... " + error)
    }
})

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        // FALTA: Controlar datos nulos


        const findUser = await userModel.findOne({email})
        
        if(!findUser) return res.json({message: "Error, el usuario no está registrado."})

        const esValidaLaContrasenia = await isValidPasswd(password, findUser.password);

        if(!esValidaLaContrasenia) return res.json({message: "Error, contraseña incorrecta."})
        //if(findUser.password !== password) return res.json({message: "Error, contraseña incorrecta."})

        //Hacer un middleware pre de mongo para mejorar:
        delete findUser.password;

        req.session.user = {
            ...findUser,
            //password: null    
        };
    
        let admin = false;
        const contraseniaAdmin = await isValidPasswd("adminCod3r123", findUser.password);
      if(findUser.email === "adminCoder@coder.com" && contraseniaAdmin){
        admin = true;
      }

      if(admin){
        req.session.user.rol = "admin"
      }else{
        req.session.user.rol = "usuario"
      }


    return res.redirect('/products/?first_name=' + (req.session?.user?.first_name || findUser.first_name) + '&last_name=' + (req.session?.user?.last_name || findUser.last_name) + '&email=' + (req.session?.user?.email || findUser.email) + '&age=' + (req.session?.user?.age || findUser.age) + '&rol='+req.session?.user?.rol);

    }catch(error){
        console.log("Error de login... " + error)

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


        console.log("Línea 139_BODY = ", req.body)

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

router.get("/current", checkAuthJwt("jwt")/*passport.authenticate("jwt", {session:false})*/,
  async (req, res) => {
    return res.json({message: "jwt en las cookies"})
  }
);

module.exports = router;

