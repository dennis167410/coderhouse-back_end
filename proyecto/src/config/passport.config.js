const passport = require("passport");
const GithubStrategy = require("passport-github2");
const local = require("passport-local");
const userModel = require("../dao/model/user.model");

const GITHUB_CLIENT_ID="caab06585e8913060dec";
const GITHUB_CLIENT_SECRET="0f25e64320407aa38f98160433eba18e033888a0";

const localStrategy = local.Strategy

const initializePassport = () => {
    passport.use("github", new GithubStrategy({
        clientID:GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/session/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        //console.log("PROFILE = ",profile);

        try{
            //console.log("PROFILE._json?.email = ", profile._json?.email)
            let user = await userModel.findOne({email: profile._json?.email});
          //  console.log("USER = ", user)
            if(!user){
                let addNewUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    email: profile._json.email,
                    age: 0,
                    password: ""
                };
                let newUser = await userModel.create(addNewUser);
                done(null, newUser);
            }else{
                //ya existe el usuario:
                done(null, false);
            }
        }catch(error){

            done(error);
        }
    }));
    
    passport.use(
        "registro", 
        new localStrategy (
            { 
        passReqToCallback: true, 
        usernameField: 'email',
    },
        async (req, username, password, done) => {
            const {first_name, last_name, email, age} = req.body;
        
            try{
                let user = await userModel.findOne({email});
                
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
            return done(error);
        }
    }
    )); 

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById({_id: id})
        done(null, user);
    });
}

module.exports = initializePassport