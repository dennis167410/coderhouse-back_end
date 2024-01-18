
const express = require("express");

const PORT = 6500;

const app = express();

app.use(express.urlencoded({extends: true}));

// Ejemplo: http://localhost:6500/products?limit=5
app.get("/products", async(request, response) =>{
    const {limit} = request.query;
    console.log("Limit = " + limit)
    const misProductos = await listarTodosLosProductos();
    
    if(!limit) return response.json({message: "Productos ", misProductos})
    
    if(misProductos){
        if(misProductos.length > 0){
            const primerosNElementos = misProductos.slice(0,limit);
            response.json({message: "Primeros "+ limit + " productos ", primerosNElementos})
        }
    }else{
        response.send({error: "No existen productos para mostrar."});
    }
})


const listarTodosLosProductos = async () => {
    try{
        const ProductManager = require("./ProductManager.js");
        const entregable = new ProductManager();
        let respuesta = await entregable.getProducts();
        return respuesta.productos;
    }catch(error){
        console.log(error)
    }
 }

app.get("/products/:pid", async(request, response) =>{
    //console.log("Parámetro en el request = " + request.params.pid)
    const miProducto = await buscarProductoPorPID(request.params.pid);
    response.json({message: "Producto ", miProducto}) 
})

const buscarProductoPorPID = async (unId) => {

    try{
        const ProductManager = require("./ProductManager.js");
        const entregable = new ProductManager();
        let respuesta = await entregable.getProductById(unId);
        
        console.log(respuesta)

        return respuesta;

    }catch(error){
        console.log(error)
    }
}

app.listen(PORT, () => {
    console.log("SERVER UP AND RUNING")
})

