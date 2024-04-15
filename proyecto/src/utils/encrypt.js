import bcrypt from 'bcrypt';

const createHash = async (unaContrasenia) => {
 const salt =  await bcrypt.genSalt();  // SALT:  Que tantas veces se aplicará el algoritmo de hasheo.
return await bcrypt.hashSync(unaContrasenia, salt); // Retornara una contraseña totalmente hasheada.
}

const isValidPasswd = async (unaContrasenia, contraseniaEncriptada) => {
    const esValida = await bcrypt.compareSync(unaContrasenia, contraseniaEncriptada);
    return esValida;
}

export {
    createHash,
    isValidPasswd
};