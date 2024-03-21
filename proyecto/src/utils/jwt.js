const jwt = require("jsonwebtoken");

const SECRET_JWT = "CLAVEs3p3rs3cr3t4S1s1";

//Configuración jwt
const generateJWT = (user) =>{
    return new Promise ((resolve, reject) => {
        jwt.sign({user}, SECRET_JWT, {expiresIn: "30m"}, (err, token)  => {
            if(err){
                console.log(err);
                reject("No se pudo crear el jwt token.");
            }
            resolve(token);
        });
    });
};

module.exports = {
    generateJWT,
    SECRET_JWT,
}