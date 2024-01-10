
const fs = require("fs/promises");

class ProductoManager{
    constructor(unaRuta){
        this.id = 0;
        this.stock = 0;
        this.productos = [];
        this.pathBD = unaRuta;
    }

    async addProduct(product){
                   
     try{
        const todosLosProductos = await this.getProducts();
        const ultimoId = todosLosProductos.length === 0 ? 1 : todosLosProductos.productos[todosLosProductos.productos.length-1].id + 1;
        const nuevoProducto = {id: ultimoId, ...product};

        nuevoProducto.code += nuevoProducto.id;

        todosLosProductos.productos.push(nuevoProducto);

        await fs.writeFile(this.pathBD, JSON.stringify(todosLosProductos))

        return nuevoProducto;

    }catch(error){
        return "Error al crear el producto.";
    }

    } 

    async getProducts(){
        try{
            const todosLosProductos = await fs.readFile(this.pathBD);
            return JSON.parse(todosLosProductos);
            
        }catch(error){
            
        }
    }

    async getProductById(unCode){
        try{
        let retorno = "Not found";
        let misProductos = await this.getProducts();
               
        misProductos.productos.forEach(unP => {
           
            if(unP.code.toLowerCase() === unCode.toLowerCase()){
               retorno = unP;
            }
        });
        return retorno;
    }catch(error){

    }
    }

    async deleteProduct(unCode){

        let respuesta = await this.getProducts();

        respuesta.productos = respuesta.productos.filter((unProducto) => unProducto.code !== unCode)

       /* console.log("AUX = ");
        console.log(aux);
        */
          
        await fs.writeFile(this.pathBD, '{"productos": '+ JSON.stringify(respuesta.productos)+'}')
        

        return "Producto eliminado."
    }


    async updateProduct(unCode, title, description, price, thumbnail, stock){
     try{
       // let respuesta = await this.getProductById(unCode);
 
      
        let respuesta = await this.getProducts();
 
        //let indice = respuesta.productos.findIndex(unObjeto => unObjeto.code === unCode.toLowerCase());
       // let indice = respuesta.productos.length
            
       // console.log("Indice = " + indice);

        console.log(respuesta.productos[0].title)

         console.log("Producto = " +respuesta.productos[2].title);
         
         //if(!this.esVacio(title)) respuesta.productos[indice].title = title;
         
        // await fs.writeFile(this.pathBD, JSON.stringify(respuesta.productos))


         /*fs.writeFile(process.cwd()+"/prueba2.txt", "Nueva línea del archivo", (err)=>{
            if(err){
                console.log(err)
            }
        })*/

      //   console.log("Producto modificado = " +respuesta.productos[indice].title);

         /*if(!this.esVacio(description)) respuesta.productos[indice].title = description;
         
         if(!this.esVacio(price)) respuesta.productos[indice].title = price;
         
         if(!this.esVacio(thumbnail)) respuesta.productos[indice].title = thumbnail;
         
         if(stock > 0) respuesta.productos[indice].title = stock;
        */

         return "¡Producto modificado con éxito!"
     }catch(error){
        console.log(error)
     }
     }


    /*
    addProduct(title, description, price, thumbnail, stock){
            const producto = {
            title, 
            description,
            price,
            thumbnail,
            code:"code", 
            stock
        };
        if(this.esVacio(title) || this.esVacio(description) || this.esVacio(thumbnail) || price < 0 || stock < 0){
            return "Datos Vacíos y/o valores negativos";
        }

        if(this.productos.length === 0){
            producto.id = 1;
        }else{
            producto.id= this.productos[this.productos.length-1].id + 1;
        }

        producto.code += producto.id;

        if(this.idEsUnico(producto.code)){
        this.productos.push(producto);
        return "¡Producto agregado!";
        } else{
            return "¡Oh no, ocurrio un error!";
            }
    }
    */

  
 


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



/*
const misProductos = new ProductoManager();
console.log("---AGREGAR---");
let tituloP1= "Bateria";
console.log(misProductos.addProduct(tituloP1,"Bateria 12v", 210, "ruta", 12));
console.log(misProductos.addProduct(tituloP1,"Bateria 18v", 250, "ruta", 14));
console.log(misProductos.addProduct(tituloP1,"Bateria 24v", 320, "ruta", 15));
console.log(misProductos.addProduct(tituloP1,"Bateria 32v", 350, "ruta", 8));

let tituloP2= "Cadena";
console.log(misProductos.addProduct(tituloP2,"Cadena moto 70cc", 360, "ruta", 21));
console.log(misProductos.addProduct(tituloP2,"Cadena moto 250cc", 390, "ruta", 17));
console.log(misProductos.addProduct(tituloP2,"Cadena moto 500cc", 430, "ruta", 17));

//Datos de Test: datos utilizados para testera que no acepta datos vacíos o negativos.
//console.log(misProductos.addProduct("","Cadena moto 500cc", 430, "ruta", 17));
//console.log(misProductos.addProduct(tituloP2,"", 430, "ruta", 17));
//console.log(misProductos.addProduct(tituloP2,"Cadena moto 500cc", -10, "ruta", 17));
//console.log(misProductos.addProduct(tituloP2,"Cadena moto 500cc", 430, "", 17));
//console.log(misProductos.addProduct(tituloP2,"Cadena moto 500cc", 430, "ruta", -10));

console.log("-----------");
console.log("---MOSTRAR PRODUCTOS REGISTRADOS---");
misProductos.getProducts();

console.log("-----------");
console.log("---BUSCAR PRODUCTO POR CODE---");
// Datos de test: Buscar por id.
//console.log(misProductos.getProductById("AAA"));
console.log(misProductos.getProductById("code6"));
console.log(misProductos.getProductById("CODE6"));

console.log("--------------------");
console.log("--- MODIFICAR PRODUCTO ---");
//console.log(misProductos.updateProduct("CODE6", "", "", 400, "", 0))
console.log(misProductos.updateProduct("CODE6", "", "", 400, "", 10))
console.log(misProductos.getProducts());
//console.log(misProductos.updateProduct("CODE6", title, description, price, thumbnail, stock))

console.log("--------------------");
console.log("--- ELIMINAR PRODUCTO ---");
console.log(misProductos.deleteProduct("CODE6"));
console.log(misProductos.getProducts());

console.log("--------------------");
console.log("--- PERSISTENCIA ---");
console.log(misProductos.guardarDatos());


//Datos de test: comprobar que id sea único.
console.log("-----------");
console.log("---TEST CODE ÚNICO---");
console.log("¿Existe el code AAA? " + !misProductos.idEsUnico("AAA"));
console.log("¿Existe el code code1? " + !misProductos.idEsUnico("code1"));
console.log("¿Existe el code Bat1? " + !misProductos.idEsUnico("Bat1"));
console.log("¿Existe el code code5? " + !misProductos.idEsUnico("code5"));
*/


module.exports = ProductoManager;
