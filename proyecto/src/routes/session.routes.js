const {Router} = require("express");
const userModel = require("../dao/model/user.model");

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

        const addUser = {
            first_name, 
            last_name, 
            email, 
            age, 
            password,
            rol:"usuario"
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
        console.log("Aca Error... " + error)
    }
})

router.post("/login", async(req, res) => {
    try{
        const {email, password} = req.body;

        const findUser = await userModel.findOne({email})
        
        if(!findUser) return res.json({message: "Error, el usuario no está registrado."})

        if(findUser.password !== password) return res.json({message: "Error, contraseña incorrecta."})

        let miRol = null
        if(findUser.rol==="admin"){
            miRol = "(admin)";
        }else{
            miRol="";
        }

        req.session.user = {
            ...findUser,
            password: null    
        };
       
    return res.redirect('/api/views/products/?first_name=' + (req.session?.user?.first_name || findUser.first_name) + '&last_name=' + (req.session?.user?.last_name || findUser.last_name) + '&email=' + (req.session?.user?.email || findUser.email) + '&age=' + (req.session?.user?.age || findUser.age) + '&rol='+miRol);

    }catch(error){
        console.log("Error de login... " + error)

    }
})

module.exports = router;

