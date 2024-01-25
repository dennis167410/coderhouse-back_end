const http = require("http");

const PUERTO = 8000;

const servidor = http.createServer((request, response) => {
    console.log("PROCESANDO LA PETICION")
    response.end("Hola mi primer respuesta del servidor.")
});

servidor.listen(PUERTO, () => {
    console.log("SERVIDOR EJECUTÁNDOSE");
})