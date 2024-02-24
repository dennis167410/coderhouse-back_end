const {Router} = require('express');
const ProductManager = require ('../dao/managers/ProductManager.js');

const router = Router();

router.get("/products", async (req, res) => {
    const {limit=10, page=1, sort, query} = req.query;

    const productManager = new ProductManager();

    const { 
        docs,
        hasPrevPage,
        hasNextPage,
        nextPage,
        prevPage
     } = await productManager.getAllProducts(limit, page, sort);

     const formatoDelDocumento = docs.map(doc => {
        return {
            id: doc._id,
            title: doc.title,
            description: doc.description,
            price: doc.price,
            category: doc.category
        };
    });


     res.render(`products`, {
        products: formatoDelDocumento,
        page,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage
     });
});

module.exports = router;