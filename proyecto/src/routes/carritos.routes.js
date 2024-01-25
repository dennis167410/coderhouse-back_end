const {Router} = require('express');

const router = Router();

//////////////////////

router.get("/", async(request, response) =>{
    const {limit} = request.query;
    const misCarritos = await listarTodosLosCarritos();
    
    if(!limit) return response.json({message: "Carritos ", misCarritos})
    
    if(misCarritos){
        if(misCarritos.length > 0){
            const primerosNElementos = misCarritos.slice(0,limit);
            response.json({message: "Primeros "+ limit + " carritos ", primerosNElementos})
        }
    }else{
        response.send({error: "No existen carritos para mostrar."});
    }
})

const listarTodosLosCarritos = async () => {
    try{
        const Carrito = require("../entidad/Carrito.js");
        const entregable = new Carrito();
        let respuesta = await entregable.getCarritos();
        return respuesta.carritos;
    }catch(error){
        console.log(error)
    }
 }

//////////////////////////////////////////

router.get("/:cid", async(request, response) =>{
    const miCarrito = await buscarCartPorCID(request.params.cid);
    response.json({message: "Carrito: ", miCarrito}) 
})

const buscarCartPorCID = async (unId) => {

    try{
        const Carrito = require("../entidad/Carrito.js");
        const entregable = new Carrito();
        let respuesta = await entregable.getCartById(unId);
        return respuesta;
    }catch(error){
        console.log(error)
    }
}

//////////////////////////////////////////

router.post("/", async(req, res) => {

    const product = req.body;
    
    try{
        // POSMAN:
        /*
         {
            "id": 1,
            "productos": [
                {
                    "id": 3,
                    "quantity:": 1
                }
                {
                    "id": 7,
                    "quantity:": 2
                }
            ]
        }
        */
     
    const Carrito = require("../entidad/Carrito.js");
    const entregable = new Carrito();
    let respuesta = await entregable.addCarrito(product); 
   
    if(respuesta === null){
        return res.json({ok: false, message: "Error al intentar crear el carrito"}); 
    }
    return res.json({ok: true, message: "Carrito registrado"});//, carrito: respuesta});
    
    }catch(error){
        console.log(error)
        }
    })

///////////////////////////////////////

router.post("/:cid/product/:pid", async(req, res) => {

    
})

///////////////////////////////////////

module.exports = router;
