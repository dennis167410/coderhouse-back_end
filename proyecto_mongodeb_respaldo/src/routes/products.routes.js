const {Router} = require('express');

const router = Router();


// Ejemplo: http://localhost:8080/api/products?limit=5
router.get("/", async(request, response) =>{
    const {limit} = request.query;
    const misProductos = await listarTodosLosProductos();

    if(!limit) return response.render('home', {name: misProductos}); //return response.json({message: "Productos ", misProductos})
    
    if(misProductos){
        if(misProductos.length > 0){
            const primerosNElementos = misProductos.slice(0,limit);
           return response.render('home', {name: primerosNElementos})
          //  response.json({message: "Primeros "+ limit + " productos ", primerosNElementos})
        }
    }else{
        response.send({error: "No existen productos para mostrar."});
    }
})

const listarTodosLosProductos = async () => {
    try{
        const ProductManager = require("../entidad/ProductManager.js");
        const entregable = new ProductManager();
        let respuesta = await entregable.getProducts();
        return respuesta.productos;
    }catch(error){
        console.log(error)
    }
 }


/////////////////////////////////////////////////////////

router.get("/:pid", async(request, response) =>{
    const miProducto = await buscarProductoPorPID(request.params.pid);
    response.json({message: "Producto ", miProducto}) 
})

const buscarProductoPorPID = async (unId) => {

    try{
        const ProductManager = require("../entidad/ProductManager.js");
        const entregable = new ProductManager();
        let respuesta = await entregable.getProductById(unId);
        return respuesta;
    }catch(error){
        console.log(error)
    }
}

//////////////////////
router.post("/", async(req, res) => {

    const product = req.body;
    
    try{
    /*
    POSTMAN:
    {
            "title": "Producto test 5",
            "description": "test5",
            "code": "code",
            "price": 670,
            "status": true,
            "stock": 120,
            "category": "cat1",
            "thumbnails": ["ruta1", "ruta2"]
        }
    */  

    const ProductManager = require("../entidad/ProductManager.js");
    const entregable = new ProductManager();
    let respuesta = await entregable.addProduct(product); 
   
    if(respuesta === null){
        return res.json({ok: false, message: "Error al intentar crear el producto"}); 
    }
    
    return res.json({ok: true, message: "Producto registrado", producto: respuesta});
    
}catch(error){
    console.log(error)
}
})

////////////////////////////////////////////////////////

//router.put('/:pid/:title/:description/:price/:status/:stock/:category/:thumbnail', async(req, res) => {
// PUT localhost:8080/api/products/1?title=Titulo actualizado del producto id 1
// PUT localhost:8080/api/products/2?title=producto 2 actualizado&stock=30   
router.put('/:pid', async(req, res) => {
    
    const {title, description, price, status, stock, category, thumbnail} = req.query; 
    
    const unId =  req.params.pid;;

     try{
        const ProductManager = require("../entidad/ProductManager.js");
        const entregable = new ProductManager();
        let respuesta = await entregable.updateProduct(unId, title, description, price, status, stock, category, thumbnail); 
       
        if(respuesta === null){
            return res.json({ok: false, message: "Error al intentar actualizar el producto"}); 
        }
        
        return res.json({ok: true, message: "_____", producto: respuesta});
        
    }catch(error){
        console.log(error)
    }
})

///////////////////////////////////////////////////////

router.delete("/:pid", async(req, res) => {

    const miProducto = req.params.pid;

    try{
    const ProductManager = require("../entidad/ProductManager.js");
    const entregable = new ProductManager();
    let respuesta = await entregable.deleteProduct(miProducto); 
   
    if(respuesta === null){
        return res.json({ok: false, message: "Error al intentar crear el producto"}); 
    }
    
    return res.json({ok: true, message: "_____", producto: respuesta});
    
}catch(error){
    console.log(error)
}
})

/////////////////////

  module.exports = router;
