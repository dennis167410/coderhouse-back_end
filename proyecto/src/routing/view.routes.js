
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

router.get("/products", authMdw, async (req, res) => {
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

export default router;
