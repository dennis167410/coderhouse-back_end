const {Router} = require('express');
const ProductManager = require ('../dao/managers/ProductManager.js');
const authMdw = require('../middleware/auth.middleware')


const router = Router();

router.get("/login", async(req, res) => {
    res.render("login");
})

router.get("/register", async(req, res) => {
    res.render("register");
})

// A esta ruta solo pueden ingresar usuarios autenticados:
router.get("/profile",authMdw ,async(req, res) => {
    const user = req.session.user;
    res.render("profile", {
        user,
    });
})

router.get("/products", async (req, res) => {
    const {limit=10, page=1, sort, query, first_name, last_name, email, rol} = req.query;

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
        first_name:first_name,
        last_name:last_name,
        email:email,
        rol:rol,
        products: formatoDelDocumento,
        page,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage
     });
});

module.exports = router;