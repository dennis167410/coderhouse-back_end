const passport = require("passport");
const local = require("passport-local");
const userModel = require("../dao/model/user.model");
const {createHash, isValidPasswd} = require("../utils/encrypt"); 

const localStrategy = local.Strategy

const initializePassport = () => {
    console.log("ENTRO")
    passport.use(
        "registro", 
        new localStrategy (
            { 
        passReqToCallback: true, 
        usernameField: 'email',
    },
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
            console.log("REGISTER STRATEGY")
            try{
                let user = await userModel.findOne({email});
                console.log("Linea 23 -> user: ", user);

                if(user){
                    // El usuario existe.
                    return done(null, false);
                }

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
                //  return done(null, false);
                }

                return done(null, newUser);
            }catch(error){
                return done(`Error al intentar obtener el usuario ${error}`)
            }
        }
        )
        );
    
    passport.use("login",
     new localStrategy({
        usernameField: "email",
    },
    async (username, password, done) => {
        try{
            console.log("LOGIN STRATEGY")
            const user = userModel.findOne({email: username});

            if(!user){
                // El usuario no existe en la base de datos
                return done(null, flase);
            }

            if(!isValidPasswd(password, user.password)){
                return done(null, false);
            }

            return done(null, user)

        }catch(error){
            console.log("Error (linea 77) ", error);
            return done(error);
        }
    }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({_id: id})
        done(null, user);
    });
}

module.exports = initializePassport