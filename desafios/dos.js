class ProductoManager{
    constructor(unaRuta){
        this.id = 0;
        this.stock = 0;
        this.productos = [];
        this.path = unaRuta;
    }

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


    modificarProducto(unCode, title, description, price, thumbnail, stock){
       let p = this.getProductById2(unCode);

        console.log("Producto = " +p.title + " " + p.description);
        
        if(!this.esVacio(title)) p.title = title;
        
        if(!this.esVacio(description)) p.description = description;
        
        if(!this.esVacio(price)) p.price = price;
        
        if(!this.esVacio(thumbnail)) p.thumbnail = thumbnail;
        
        if(stock > 0) p.stock = stock;

        return "¡Producto modificado con éxito!"
    }

    getProducts(){
        this.productos.forEach(unP => console.log(unP));
    }

    getProductById(unCode){
        let retorno = "Not found";
        this.productos.forEach(unP => {
            if(unP.code.toLowerCase() === unCode.toLowerCase()){
               retorno = unP.code + " " + unP.title + " " + unP.description + " " + unP.price + " " + unP.stock;
            }
        });
        return retorno;
    }
    
    getProductById2(unCode){
        let retorno = "Not found";
        this.productos.forEach(unP => {
            if(unP.code.toLowerCase() === unCode.toLowerCase()){
               retorno = unP;
            }
        });
        return retorno;
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
//console.log(misProductos.modificarProducto("CODE6", "", "", 400, "", 0))
console.log(misProductos.modificarProducto("CODE6", "", "", 400, "", 10))
console.log(misProductos.getProducts());
//console.log(misProductos.modificarProducto("CODE6", title, description, price, thumbnail, stock))

//Datos de test: comprobar que id sea único.
console.log("-----------");
console.log("---TESTE CODE ÚNICO---");
console.log("¿Existe el code AAA? " + !misProductos.idEsUnico("AAA"));
console.log("¿Existe el code code1? " + !misProductos.idEsUnico("code1"));
console.log("¿Existe el code Bat1? " + !misProductos.idEsUnico("Bat1"));
console.log("¿Existe el code code5? " + !misProductos.idEsUnico("code5"));
