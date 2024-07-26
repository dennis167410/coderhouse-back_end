
import {UserService} from '../repository/index.js';
import {ProductService} from '../repository/index.js';
import { sendEmail } from '../routing/email.routes.js';
import { ObjectId} from 'mongodb';
export default class ProductController{
    productService;
    userService;

    constructor(){
        this.productService = ProductService;
        this.userService = UserService;
    }

 getAllProducts = async(req, res) => {
    try{
        const {limit=10, page=1, sort, query} = req.query;
     const { 
        docs,
        totalDocs,
        limit:limitPage,
        totalPages,
        hasNextPage,
        prevPage,
        nextPage
     } = await this.productService.getAllProducts(limit, page, sort);

     
        return res
        .status(200)
        .json({   
        message:"Todos los productos",
        products: docs,
        length: totalDocs,
        limit: limitPage,
        page,
        totalPages,
        hasNextPage,
        prevPage,
        nextPage
            })
        
            
        /*    const response = {
                message: "Todos los productos",
                products: docs,
                length: totalDocs,
                limit: limitPage,
                page,
                totalPages,
                hasNextPage,
                prevPage,
                nextPage,
                user: req.session.user
            };   
            return this.handleResponse(req, res, response, 200);
*/
    }catch(error){
        req.logger.error("Error ", error);
    }
}

createProduct = async(req, res) => {
    try{
       const productData = req.body; 
       const {title, description, code, price, status, stock, category, thumbnails, owner} = productData;

       req.logger.info(title + " " + description + " " + code + " " + price + " " + status + " " + stock + " " + category + " " + thumbnails + " " + owner) 

       if(!code || !title || !description || !price || !status || !stock || !category) return res
       .status(404)
       .json({
           message: 'Datos nulos o vacíos.'
       });

       const result = await this.productService.addProducts(productData, req.session.user, req.session.role); 
        
        if(!result){
            req.logger.warning('No se pudo crear el producto. Faltan datos o la clave puede estar duplicada.');
            return res
            .status(404)
            .json({
                message: "Error, clave duplicada",
            })
        }
        req.logger.info(result);
     
        return res
            .status(200)
            .json({
            message: result,
        })
        
    }catch(error){
        req.logger.error("Error ", error);
        return null;
    }
}

getProductById = async( req, res) =>{
    try{
        const productId = req.params.pid;
      
        if (!ObjectId.isValid(productId)) {
            req.logger.error('El formato del ID no es válido');
            return this.handleResponse(req, res, {message: "Error, El formato del ID no es válido."}, 500);          
        }

        const product = await this.productService.getProductById(productId); 

        if(!product || product.length == 0){
            req.logger.warning('El producto no existe.');
            return res
            .status(404)
            .json({
                ok: true,
                message: 'Producto no existe...'
            })
        }

        return res
        .status(200)
        .json({
            ok: true,
            message: 'Producto...',
            product,
        })
    }catch(error){
        req.logger.error('Error, ', error);
    }
}

productsByCategory = async( req, res) => {
    try{
        const productCategory = req.params.category;
        const { sort } = req.body;

        const products = await this.productService.productsByCategory(productCategory, sort); 

       if(!products || products.length === 0){
            req.logger.info('No existen productos en la categoria para mostrar.');
            return res
            .status(404)
            .json({
                ok: true,
                message: 'No existen productos para esa categoria.'
            })
        }

        return res
        .status(200)
        .json({
            ok: true,
            message: 'Productos...',
            products,
        })
    }catch(error){
        req.logger.error('Error, ', error);
    }
}

productsByDispo = async(req, res) => {
    try{
        const productDispo = req.params.disponibilidad;
        const { sort } = req.body;

        const products = await this.productService.productsByDispo(productDispo, sort); 

        req.logger.info(productDispo)
       if(!products || products.length === 0){
            req.logger.info('No existen productos con esa disponibilidad.');
            return res
            .status(404)
            .json({
                ok: true,
                message: 'No existen productos para esa disponibilidad.'
            })
        }

        return res
        .status(200)
        .json({
            ok: true,
            message: 'Productos con dispopnibilidad' ,
            products,
        })
    }catch(error){
        req.logger.info('Error, ', error);
    }
}

deleteProductById = async(req, res) => {
    try{

        //Solo para supertest:
        //req.session.user = "ADMIN";
        //req.session.role = "ADMIN";
        ///////////////////////////

        const productId = req.params.pid;

        req.logger.info("productId = "+ productId);

        if (!ObjectId.isValid(productId)) {
            req.logger.error('El formato del ID no es válido');
            return this.handleResponse(req, res, {message: "Error, El formato del ID no es válido."}, 500);          
        }

        const product = await this.productService.getProductById(productId);

        req.logger.info("product find = " + product)

        if(!product){
            req.logger.info("El producto no existe.");
           /* return res
            .status(404)
            .json({
                ok: true,
                message: 'El producto no existe...'
            })*/
            return this.handleResponse(req, res, {ok: false, message: "Error, el producto no existe."}, 404);          
        }

        req.logger.info("product.owner = " + product.owner);
        let owner =  product.owner;

        req.logger.info("Dueño del producto = " + owner)
        req.logger.info("Rol del usuario logueado = " + req.session.role)

        if(req.session.role === "PREMIUM"){
            if(req.session.user === product.owner){
                req.logger.info("Es premium y es el dueño del producto.")
            }else{
                req.logger.warning("Usted es cliente PREMIUM, pero NO eres el dueño del producto.")
                return this.handleResponse(req, res, {ok: false, message: "Usted es cliente PREMIUM, pero NO es el dueño del producto."}, 401);          
 
                /*return res
                .status(401)
                .json({
                    ok: false,
                    message: 'Usted es cliente PREMIUM, pero NO es el dueño del producto.'
                })*/
            }
        }

        let findUser = "";

        if(req.session.role === "PREMIUM"){
            findUser = await this.userService.getUserByEmail(owner);
        }

        if(req.session.role === "ADMIN"){
            findUser = await this.userService.getUserByRole(owner);
        }

        req.logger.info("findUser = " + findUser)

        if(req.session.role === "ADMIN"){
            req.logger.info("findUser en delete = " + findUser);
            if(findUser.role === "PREMIUM"){
                req.logger.info("El dueño del producto es cliente premium, debemos avisarle de la eliminación del producto.")

                sendEmail(
                    owner,
                    "Aviso de producto eliminado",
                    `Hola, el producto ${product[0].title} fue eliminado por ${ req.session.user}.`
                );    
            }
        }

        const productDeleted = await this.productService.deleteProductById(productId); 

        req.logger.info( req.session.user)
        if(req.session.user === owner && findUser.role === "PREMIUM"){
            sendEmail(
                req.session.user,
                "Aviso de producto eliminado",
                `Hola, el producto ${product.title} fue eliminado por ${ req.session.user}.`
            );
        }

        return res
        .status(200)
        .json({
            ok: true,
            message: 'Producto eliminado.',
            productDeleted,
        })
    
    }catch(error){
        req.logger.error("Error ", error);
        return this.handleResponse(req, res, {message: "Error interno del servidor."}, 500);          
     
    }
}


/*
POSMAN:
   PUT localhost:8080/api/products/65ceb99486869118617b2cef
En el body:
    {
        "description": "Producto prueba actualización mongo",
        "price": 10, 
        "stock": 10
    }
*/

 updateProduct = async(req, res) => {
    try{
        const productId =  req.params.pid;
    
        req.logger.info("PID = " + productId)
        if (!ObjectId.isValid(productId)) {
            req.logger.error('El formato del ID no es válido');
            return this.handleResponse(req, res, {message: "Error, El formato del ID no es válido."}, 500);          
        }

        const product = await this.productService.updateProduct(productId, req.body); 

        
        if(!product){
            req.logger.info("El producto no existe, por tal motivo no pudo ser actualizado.");
           /* return res
            .status(400)
            .json({
                ok: false,
                message: 'El producto no existe, por tal motivo no pudo ser actualizado.'
            })*/
            return this.handleResponse(req, res, {message: "El producto no existe, por tal motivo no pudo ser actualizado."}, 400);            
        }

      /*  return res
        .status(200)
        .json({
            ok: true,
            message: 'Producto actualizado.',
            product,
        })
        */
        return this.handleResponse(req, res, {message: "El producto actualizado."}, 200);          
        

    }catch(error){
       req.logger.error("Error, ", error)
       return this.handleResponse(req, res, {message: "Error interno del servidor."}, 500);          
    }
}

handleResponse = (req, res, response, statusCode) => {
    if (req.headers['content-type'] === 'application/json' || req.xhr) {
        return res.status(statusCode).json(response);
    } else {
        req.session.first_name = response.first_name;
        req.session.last_name = response.last_name;
        req.session.email = response.email;
        req.session.role = response.role;
        req.session.user = response.user;
        return res.status(statusCode).render('products', response);
    }
  };

}
