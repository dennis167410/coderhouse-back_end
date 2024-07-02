
import {Router} from'express';
import passport from "passport";

import ProductManager from '../dao/managers/ProductManager.js';
import authMdw from'../middleware/auth.middleware.js';

const router = Router();

router.get("/login", async(req, res) => {
    res.render("login");
})

router.post("/login", 
    passport.authenticate("login", {
    successRedirect:"/",
    failureRedirect: "/faillogin",
    failureFlash: true,
    })
    );


router.get("/faillogin", async (req, res) => {
    res.send({error: "Fallo la estrategia de login."});
})

router.get("/register", async(req, res) => {
    res.render("register");
}
); 

router.post("/register", passport.authenticate("registro", { 
    successRedirect:"/failregister",
    failureRedirect: "/failregister",
    failureFlash: true,
})
);

router.get("/failregister", async (req, res) => {
    res.send({error: "Fallo la estrategia de registro."});
})

router.get("/recover", async(req, res) => {
    res.render("recover");
})

// A esta ruta solo pueden ingresar usuarios autenticados:
router.get("/profile",authMdw ,async(req, res) => {
    const user = req.session.user;
    res.render("profile", {
        user,
    });
})

// A esta ruta solo pueden ingresar el adminiatrador:
router.get("/users", async(req, res) => {
    const user = req.session.user;
    res.render("users", {
        user,
    });
})

router.get("/products", authMdw, async (req, res) => {
    const {limit=10, page=1, sort, query, first_name, last_name, email, rol} = req.query;

    req.session.first_name = first_name;
    req.session.last_name = last_name;
    req.session.email = email;
    req.session.rol = rol;


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
        first_name,
        last_name,
        email,
        rol,
        products: formatoDelDocumento,
        page,
        hasNextPage,
        hasPrevPage,
        prevPage,
        nextPage
     });
});

/*
router.post('/purcharse', (req, res) => {
    const { selectedProducts } = req.body;
    res.render('purcharse', { selectedProducts });
});*/

router.post('/purcharse', (req, res) => {
        let selectedProducts = req.body.selectedProducts;
    
        if (!Array.isArray(selectedProducts)) {
            selectedProducts = [selectedProducts];
        }

        res.render('purcharse', {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            rol: req.body.rol,
            user: req.body.user,
            selectedProducts: selectedProducts
        });
    
    
    /*const { selectedProducts } = req.body;
    const quantities = {}; 

    selectedProducts.forEach(product => {
        quantities[product] = 1;
    });

    res.render('purcharse', { selectedProducts, quantities, cartId: req.session.cartId }); */
});

export default router;
