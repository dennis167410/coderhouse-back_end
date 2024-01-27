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
                },
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
   const cid = req.params.cid;
   const pid = req.params.pid;
  // console.log("BODY = " , req.body)
   const carrito = req.body;
   const unaCantidad = carrito.producto[0].quantity;

   console.log("Cantidad = " + unaCantidad);
  /* console.log("CARRITO ", carrito)
   console.log("Producto = " + carrito.producto[0].id + " Cantidad = " + carrito.producto[0].quantity)
*/

    try{
        const Carrito = require("../entidad/Carrito.js");
        const entregable = new Carrito();
        let respuesta = await entregable.updateCart(cid, pid, unaCantidad); 
       
        if(respuesta === null){
            return res.json({ok: false, message: "Error al intentar actualizar el carrito"}); 
        }
        
        return res.json({ok: true, message: "_____", Carrito: respuesta});
        
    }catch(error){
        console.log(error)
    }

})

///////////////////////////////////////

module.exports = router;
