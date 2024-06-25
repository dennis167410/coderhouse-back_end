import passport from "passport";

function handlePolicies(policies) {
   return (req, res, next) => {
    // Verifica si la única política es "PUBLIC"
    if (policies.length === 1 && policies[0] === "PUBLIC") {
      return next();
    }

    // Usa Passport para autenticar al usuario y verificar el rol
    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      console.log("Roles ", userJWT.user.userDto.role);   
      if (err) {
        return next(err);
      }
      if (!userJWT) {
        return res
          .status(401)
          .send({ message: "Acceso denegado. El Token no es válido o está expirado." });
      }
      if (policies.includes(userJWT.user.userDto.role)) {
        req.user = userJWT;
        return next();
      } else {
        return res
          .status(403)
          .send({ message: "Acceso denegado. Rol no autorizado." });
      }
    })(req, res, next);
    console.log(policies)
  
  };
 
}



export default handlePolicies;