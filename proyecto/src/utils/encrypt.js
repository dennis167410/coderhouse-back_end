const bcrypt = require('bcrypt');

const createHash = async (unaContrasenia) => {
 const salt =  await bcrypt.genSalt();  
return await bcrypt.hashSync(unaContrasenia, salt); 
}

const isValidPasswd = async (unaContrasenia, contraseniaEncriptada) => {
    const esValida = await bcrypt.compareSync(unaContrasenia, contraseniaEncriptada);
    return esValida;
}

module.exports = {
    createHash,
    isValidPasswd
};