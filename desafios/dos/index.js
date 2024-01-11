
const path = require("path");

const ProductoManager = require("./dos");

const entregableDos = async () => {

    try{
        const rutaBD = path.join(__dirname, "base_datos.json");
        const entregable = new ProductoManager(rutaBD);
       
        const producto = {
            title: "Cadena RXD", 
            description: "Cadena máquina",
            price: 1440,
            thumbnail:"ruta",
            code:"code", 
            stock:4
        };

        /*
        const producto = {
            title: "Cadena RXD", 
            description: "Cadena máquina",
            price: -14,
            thumbnail:"ruta",
            code:"code", 
            stock:4
        };
        */

        /*
        const producto = {
            title: "Cadena RXD", 
            description: "Cadena máquina",
            price: "1250",
            thumbnail:"ruta",
            code:"code", 
            stock:-10
        };
        */

        /*
        const producto = {
            title: "Cadena RXD", 
            description: "Cadena máquina",
            price: "1250",
            thumbnail:"",
            code:"code", 
            stock:4
        };
        */
        
      /* console.log("--- CREAR PRODUCTO ---");
       const nuevoProducto = await entregable.addProduct(producto);
       console.log(nuevoProducto);
      */

        /*
        console.log("-----------");
        console.log("---BUSCAR PRODUCTO POR CODE---");
        let p = await entregable.getProductById("CODE3")
        console.log(p);
        */
       
      /*
        console.log("--------------------");
        console.log("--- MODIFICAR PRODUCTO ---");
        let r = await entregable.updateProduct("code2", "modificacion prueba 3", "", 400, "", 10)
        conole.log(r);
        */
    

       /* console.log("--------------------");
        console.log("--- ELIMINAR PRODUCTO ---");
        let r = await entregable.deleteProduct("code8")
        console.log(r);*/
        

    }catch(error){
        console.log("ERROR")
    }
}

entregableDos()

