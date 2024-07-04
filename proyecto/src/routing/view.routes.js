
import {Router} from'express';
import passport from "passport";

import ProductManager from '../dao/managers/ProductManager.js';
import authMdw from'../middleware/auth.middleware.js';
import handlePolicies from '../middleware/handle-policies.middleware.js';

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
router.get("/users",handlePolicies(['ADMIN']),  async(req, res) => {
    const user = req.session.user;
    if(!user)
        return handleResponse(req, res, {message: "Error interno del servidor... "}, 500);
    
    
    return handleResponse(req, res, {message: "ok "}, 200);
    
    
    /*res.render("users", {
        user,
    });*/
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
});

const handleResponse = (req, res, response, statusCode) => {
    if (req.headers['content-type'] === 'application/json' || req.xhr) {
        return res.status(statusCode).json(response);
    } else {
        return res.status(statusCode).render('users', response);
    }
  };

export default router;
