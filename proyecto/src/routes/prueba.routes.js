const {Router} = require('express');
const pruebaData = require('../base_de_datos/products.js')
const pruebaModel = require('../model/prueba.model');

const router = Router();

router.get('/insertion', async (req, resp) =>{
    try{
        let result = await pruebaModel.insertMany(pruebaData)
       
        return resp.json({
            message: 'Exitosa inserción masiva.',
            prueba: result

        }) 
    }catch(error){
        console.log("Error... ", error)
    }
})

router.get('/', async (req, resp) =>{
    try{
        let result = await pruebaModel.find();

        return resp.json({
            message: 'Listado de productos...',
            result,
        })
    }catch(error){
        console.log("Error... ", error)
    }
})

router.get('/consultas', async (req, resp) =>{
    try{
       /* let precioMayorIgual500 = await pruebaModel.find({
            price: {$gte: 500}
        }); */

        let productosCat2 = await pruebaModel.find({
            category: /^cat2$/i,
        });
        

        const updateProductPrice = await pruebaModel.updateOne({
            _id: "65c82e490e8bc18bc9dbbc29",
        },
    {
        $set: {
            price: 999,
            stock: 999
        }
    }
    );

       /* return resp.json({
            message: 'Listado de productos...',
            precioMayorIgual500,
        }) */

        return resp.json({
            message: 'Listado de productos categoría 2...',
            productosCat2,
            updateProductPrice,
        })
    }catch(error){
        console.log("Error... ", error)
    }
})


module.exports = router;
