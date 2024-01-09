const fs = require('fs')
const path = require('path')

try {
    const pathFile = path.join(__dirname, "prueba2.txt")
    console.log("Donde estoy = " + pathFile)

    const contentFile = fs.readFileSync(pathFile, "utf-8")
    console.log(contentFile)

} catch (error) {
    console.log(error)
}

//Sobreescribe el archivo.
/*
fs.writeFile(process.cwd()+"/prueba2.txt", "Nueva línea del archivo", (err)=>{
    if(err){
        console.log(err)
    }
})
*/

//Agrega el dato al archivo. El archivo debe existir.
fs.appendFile(process.cwd()+"/prueba2.txt", "Nueva nueva línea del archivo ", (err)=>{
    if(err){
        console.log(err)
    }
})






