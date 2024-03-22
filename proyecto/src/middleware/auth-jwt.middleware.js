const passport = require("passport");

const checkAuthJwt = (strategy) => {
    return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
        console.log("info = ", info);

        if(error) return next(error);
        if(!user){
            return res
            .status(401)
            .json({message: info.message ? info.message : info.toString()})
        }
        req.user = user;
        next();
    })(req, res, next); 
}
}

module.exports = checkAuthJwt