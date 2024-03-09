const {Router} = require("express");

const userModel = require("../dao/model/user.model");
const {createHash, isValidPasswd} = require("../utils/encrypt"); 

const router = Router();

router.get("/logout", async(req, res) => {
    req.session.destroy(error => {
        if(!error) return res.redirect('/api/views/login');
        return res.send({message: "logout error", body: error});
    })
})

router.post("/register", async(req, res) => {
    try{
        const {first_name, last_name, email, age, password} = req.body;

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
        return res.redirect('/api/views/login');

    }catch(error){
        console.log("Error... " + error)
    }
})

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        const findUser = await userModel.findOne({email})
        
        if(!findUser) return res.json({message: "Error, el usuario no está registrado."})

        const esValidaLaContrasenia = await isValidPasswd(password, findUser.password);

        if(!esValidaLaContrasenia) return res.json({message: "Error, contraseña incorrecta."})
        // if(findUser.password !== password) return res.json({message: "Error, contraseña incorrecta."})

        delete findUser.password;

        req.session.user = {
            ...findUser,
            password: null    
        };
    
        let admin = false;
      if(findUser.email === "adminCoder@coder.com" && findUser.password === "adminCod3r123"){
        admin = true;
      }

      if(admin){
        req.session.user.rol = "admin"
      }else{
        req.session.user.rol = "usuario"
      }


    return res.redirect('/api/views/products/?first_name=' + (req.session?.user?.first_name || findUser.first_name) + '&last_name=' + (req.session?.user?.last_name || findUser.last_name) + '&email=' + (req.session?.user?.email || findUser.email) + '&age=' + (req.session?.user?.age || findUser.age) + '&rol='+req.session?.user?.rol);

    }catch(error){
        console.log("Error de login... " + error)

    }
})

router.post("/recover-psw", async (req, res) => {
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
        res.redirect('/api/views/login');
       // return res.render("login");

    }catch(error){

    }
})


module.exports = router;

