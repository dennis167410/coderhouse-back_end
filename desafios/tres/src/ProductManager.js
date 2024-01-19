
const fs = require("fs/promises");
const path = require('path')

class ProductManager{
     constructor(){  
        this.id = 0;
        this.stock = 0;
        this.productos = [];
    }

    async getProducts(){
        try{
            const todosLosProductos = await fs.readFile("./dominio/base_datos.json", "utf-8");
            return JSON.parse(todosLosProductos);
        }catch(error){
            console.log("El archivo no existe.");
            await fs.writeFile("./dominio/base_datos.json", "[]");
            return [];
        }
    }

    async getProductById(unPid){
        try{
        let retorno = "Not found";
        let misProductos = await this.getProducts();
        
        if(misProductos.length === 0) return "Archivo vacío";

        misProductos.productos.forEach(unP => { 
            console.log("Pid = " + unPid + " - " + unP.id)  
           //  if(unP.code.toLowerCase() === unCode.toLowerCase()){
            if(unP.id == unPid){
               retorno = unP;
            }
        });
        return retorno;
    }catch(error){

    }
    }


     //----------Métodos auxliares -------------------
     idEsUnico(unCode){
        let cant = 0;
        this.productos.forEach(unP => {
            if(unP.code === unCode){
                cant++;
            }
        });

        return cant===0;
    }

    esVacio(unaCadena){
        return unaCadena === 0 || unaCadena === undefined || unaCadena.length == 0;
    }
    ///////////////////////////////////////////////////////

}

module.exports = ProductManager;

///////////////////////////////////////////////////////////////////////

/*
    async addProduct(product){
         
        try{
   
           if(this.esVacio(product.title) || this.esVacio(product.description) || this.esVacio(product.thumbnail) || product.price < 0 || product.stock < 0){
               return "Datos Vacíos y/o valores negativos";
           } 
   
           const todosLosProductos = await this.getProducts();
           const ultimoId = todosLosProductos.length === 0 ? 1 : todosLosProductos.productos[todosLosProductos.productos.length-1].id + 1;
           const nuevoProducto = {id: ultimoId, ...product};
   
           nuevoProducto.code += nuevoProducto.id;
   
           todosLosProductos.productos.push(nuevoProducto);
   
           await fs.writeFile("./dominio/base_datos.json", JSON.stringify(todosLosProductos))
   
           return nuevoProducto;
   
       }catch(error){
           return "Error al crear el producto.";
       }
       } 

    async deleteProduct(unCode){
        try{

        if(this.esVacio(unCode)){
            return "Datos vacíos.";
        } 

        let respuesta = await this.getProducts();
        respuesta.productos = respuesta.productos.filter((unProducto) => unProducto.code !== unCode)          
        await fs.writeFile(this.pathBD, '{"productos": '+ JSON.stringify(respuesta.productos)+'}')
        return "Producto eliminado."
        }catch(error){
            console.log("Error al eliminar el producto.");
        }
    }


    async updateProduct(unCode, title, description, price, thumbnail, stock){
     try{
        let r = "Not found";

        let respuesta = await this.getProducts();
        respuesta.productos.forEach((unProducto)=>{
            if(unProducto.code === unCode){
                if(!this.esVacio(title)) unProducto.title = title;
                if(!this.esVacio(description)) unProducto.description = description;
                if(price > 0) unProducto.price = price;
                if(!this.esVacio(thumbnail)) unProducto.thumbnail = thumbnail;
                if(stock > 0) unProducto.stock = stock;

                r = "¡Producto modificado con éxito!"
            
            }    
        })          

        await fs.writeFile(this.pathBD, '{"productos": '+ JSON.stringify(respuesta.productos)+'}')
        return r;
     }catch(error){
        console.log(error)
     }
     }
*/
   
