const {Router} = require('express');
const productData = require('../base_de_datos/products.js')
const productModel = require('../model/product.model.js');

const router = Router();

router.get('/insertion', async (req, resp) =>{
    try{
        let result = await productModel.insertMany(productData)
       
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
        let result = await productModel.find();

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

        let productosCat2 = await productModel.find({
            category: /^cat2$/i,
        });
        
/*
        const updateProductPrice = await productModel.updateOne({
            _id: "65c82e490e8bc18bc9dbbc29",
        },
    {
        $set: {
            price: 999,
            stock: 999
        }

    }

   
    );
 */

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
