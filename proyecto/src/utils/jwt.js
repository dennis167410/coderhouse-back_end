
import jwt from "jsonwebtoken";

const SECRET_JWT = "CLAVEs3p3rs3cr3t4S1s1";

//Configuración jwt
const generateJWT = (user) =>{
    return new Promise ((resolve, reject) => {
        jwt.sign({user}, SECRET_JWT, {expiresIn: "30m"}, (err, token)  => {
            if(err){
                console.log(err);
                reject("No se pudo crear el jwt token.");
            }
            //console.log("Estoy en generateJWT = ", token)
            resolve(token);
        });
    });
};

const verifyTokenJWT = (unToken) => {
    return new Promise((resolve, reject) => {
        jwt.verify(unToken, SECRET_JWT, (err, decoded) => {
          if (err) {
            reject(err);
          } else {
          //  console.log("estoy en verfy() = ", decoded.emailReceiver)
            resolve(decoded);
          }
        });
      });
}


export {
    generateJWT,
    verifyTokenJWT,
    SECRET_JWT,
}