
const fs = require("fs/promises");
const path = require('path')

class Carrito{
    constructor(){  
       this.id = 0;
       this.productos = [];
   }

///////////////////////////////

   async getCarritos(){
    try{
        const todosLosCarritos = await fs.readFile("./src/base_de_datos/bd_carritos.json", "utf-8");
        return JSON.parse(todosLosCarritos);
    }catch(error){
        console.log("El archivo no existe.");
        await fs.writeFile("./src/base_de_datos/bd_carritos.json", "[]");
        return [];
    }
}

////////////////////////////////////

async getCartById(unCid){
    try{
    let retorno = "Not found";
    let misCarritos = await this.getCarritos();
    
    if(misCarritos.length === 0) return "Archivo vacío";

    misCarritos.carritos.forEach(unC => {  
        if(unC.id == unCid){
           retorno = unC;
        }
    });
    return retorno;
}catch(error){
}

}

////////////////////////////////////

   async addCarrito(product){
         
    try{

       const todosLosCarritos = await this.getCarritos();
       const ultimoId = todosLosCarritos.length === 0 ? 1 : todosLosCarritos.carritos[todosLosCarritos.carritos.length-1].id + 1;
       const nuevoProductoAlCarrito = {id: ultimoId, ...product};

       todosLosCarritos.carritos.push(nuevoProductoAlCarrito);

       await fs.writeFile("./src/base_de_datos/bd_carritos.json", JSON.stringify(todosLosCarritos))

       console.log("Bien = " + nuevoCarrito)
       return nuevoCarrito; // Lo cambiaré por true

   }catch(error){
       return "Error al crear el carrito.";
   }
   } 



}

module.exports = Carrito;