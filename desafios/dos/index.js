
const path = require("path");

const ProductoManager = require("./dos");

const entregableDos = async () => {

    try{
        const rutaBD = path.join(__dirname, "base_datos.json");
        const entregable = new ProductoManager(rutaBD);
       // const misProductos = await entregable.getProducts();
       // console.log("TODOS PRODUCTOS")
        //console.log(misProductos)

        const producto = {
            title: "Cadena RXD", 
            description: "Cadena máquina",
            price: "1250",
            thumbnail:"ruta",
            code:"code", 
            stock:4
        };

       /* 
        console.log("--- CREAR PRODUCTO ---");
       const nuevoProducto = await entregable.addProduct(producto);
       console.log(nuevoProducto);
      */

        /*console.log("-----------");
        console.log("---BUSCAR PRODUCTO POR CODE---");
        // Datos de test: Buscar por id.
        let p = await entregable.getProductById("CODE1")
        console.log(p);
       */
        console.log("--------------------");
        console.log("--- MODIFICAR PRODUCTO ---");
        let r = await entregable.updateProduct("code6", "pruebaMod", "", 400, "", 10)
        conole.log(r);
    

       /* console.log("--------------------");
        console.log("--- ELIMINAR PRODUCTO ---");
        let r = await entregable.deleteProduct("code2")
        console.log(r);
        */

    }catch(error){
        console.log("ERROR")
    }
}

entregableDos()

