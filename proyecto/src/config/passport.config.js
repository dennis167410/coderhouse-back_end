
import passport from "passport";
import GithubStrategy from "passport-github2";
import local from "passport-local";
import jwt from 'passport-jwt';

import userModel from "../dao/model/user.model.js";
import {SECRET_JWT} from '../utils/jwt.js';
import ROLES from "../constantes/role.js";
import {GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET} from "./config.js";

const GITHUB_CLIENT_ID_APP= GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET_APP= GITHUB_CLIENT_SECRET;

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const localStrategy = local.Strategy

const cookieJWTExtractor = (req) => {
    let token;
    if(req && req.cookies){
        token = req.cookies["cookieToken"];
    }
    return token;
}

const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieJWTExtractor]), 
        secretOrKey: SECRET_JWT,
    },
        async (jwtPayload, done) => {
                try{
              //  console.log("jwtPayload ", jwtPayload.userDto)
                if(ROLES.includes(jwtPayload.user.userDto.role)){      
                    return done(null, jwtPayload);
                }
                }catch(error){
                    console.log("Error, ", error);
                    return done(error);
                }

        }
    )
    );


    passport.use("github", new GithubStrategy({
        clientID:GITHUB_CLIENT_ID_APP,
        clientSecret: GITHUB_CLIENT_SECRET_APP,
        callbackURL: "http://localhost:8080/api/session/github/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        //console.log("PROFILE = ",profile);

        try{
            //console.log("PROFILE._json?.email = ", profile._json?.email)
            let user = await userModel.findOne({email: profile._json?.email});

            if(user){
                return done(null, user);
            }

            if(!user){
                let addNewUser = {
                    first_name: profile._json.login,
                    last_name: "",
                    email: profile._json.email,
                    age: 0,
                    password: null
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


export default initializePassport