
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
            const todosLosProductos = await fs.readFile("./src/base_de_datos/bd_productos.json", "utf-8");
            return JSON.parse(todosLosProductos);
        }catch(error){
            console.log("El archivo no existe.");
            await fs.writeFile("./src/base_de_datos/bd_productos.json", "[]");
            return [];
        }
    }

    
    async getProductById(unPid){
        try{
        let retorno = "Not found";
        let misProductos = await this.getProducts();
        
        if(misProductos.length === 0) return "Archivo vacío";

        misProductos.productos.forEach(unP => {  
           //  if(unP.code.toLowerCase() === unCode.toLowerCase()){
            if(unP.id == unPid){
               retorno = unP;
            }
        });
        return retorno;
    }catch(error){
    }
    
    }

    async existeProductById(unPid){
        try{
        let retorno = flase;
        let misProductos = await this.getProducts();
        
        if(misProductos.length === 0) return false;

        misProductos.productos.forEach(unP => {  
            if(unP.id == unPid){
               retorno = true;
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

    async addProduct(product){
         
        try{
   
           if(this.esVacio(product.title) || this.esVacio(product.description) || this.esVacio(product.thumbnail) || product.price < 0 || product.stock < 0){
              // return "Datos Vacíos y/o valores negativos";
              return null;
           }
   
           const todosLosProductos = await this.getProducts();
           const ultimoId = todosLosProductos.length === 0 ? 1 : todosLosProductos.productos[todosLosProductos.productos.length-1].id + 1;
           const nuevoProducto = {id: ultimoId, ...product};
   
           nuevoProducto.code += nuevoProducto.id;
   
           todosLosProductos.productos.push(nuevoProducto);
   
           await fs.writeFile("./src/base_de_datos/bd_productos.json", JSON.stringify(todosLosProductos))
   
           return nuevoProducto;
   
       }catch(error){
           return "Error al crear el producto.";
       }
       } 

    //////////////////////////////////

    async deleteProduct(unId){
        try{

        if(this.esVacio(unId)){
            return "Dato vacío.";
        } 

        let respuesta = await this.getProducts();
        respuesta.productos = respuesta.productos.filter((unProducto) => unProducto.id != unId)          
        await fs.writeFile("./src/base_de_datos/bd_productos.json", '{"productos": '+ JSON.stringify(respuesta.productos)+'}')
        return "Producto eliminado."
        }catch(error){
            console.log("Error al eliminar el producto.");
        }
    }

////////////////////////////////////////////////////////

    async updateProduct(unId, title, description, price, status, stock, category, thumbnail){
     try{
        let r = "Not found";

        let respuesta = await this.getProducts();
        respuesta.productos.forEach((unProducto)=>{
            if(unProducto.id == unId){
                if(!this.esVacio(title)) unProducto.title = title;
                if(!this.esVacio(description)) unProducto.description = description;
                if(price > 0) unProducto.price = price;
                if(!this.esVacio(status)) unProducto.status = status;
                if(stock > 0) unProducto.stock = stock;
                if(!this.esVacio(category)) unProducto.category = category;
                if(!this.esVacio(thumbnail)) unProducto.thumbnail = thumbnail;

                r = "¡Producto modificado con éxito!";

            }    
        })          

        await fs.writeFile('./src/base_de_datos/bd_productos.json', '{"productos": '+ JSON.stringify(respuesta.productos)+'}')
        return r;
     }catch(error){
        console.log(error)
     }
     }

}

module.exports = ProductManager;