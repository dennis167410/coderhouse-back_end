import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos", () => {
    let requester = supertest(`${BASE_API_URL}`);  

   /*
    it("TEST POST /api/products crear correctamente un producto con codigo 200 ", async () => {   
           
        const bodyProduct = {
            title: "Producto 1 -23 de mayo - supertest",
            description: "El producto 1 - 23 de mayo - supertest",
            code: "code20240523_st1",
            price: 236,
            status: false,
            stock: 23,
            category: "cat3",
            thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"]
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${PRODUCTS_ROUTE}`)
          .send(bodyProduct);
    
        expect(ok).to.be.true;
        expect(statusCode).to.eq(200);
        expect(_body.message).to.have.property("_id");
      });
      */

/*
    it("TEST POST /api/products crear un producto sin código de producto deberá retornar 404 ", async () => {
        const bodyProduct = {
            title: "Producto 2 -23 de mayo - supertest",
            description: "El producto 2 - 23 de mayo - supertest",
            price: 236,
            status: false,
            stock: 23,
            category: "cat3",
            thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"]
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${PRODUCTS_ROUTE}`)
          .send(bodyProduct);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(404);
        expect(_body).to.deep.equals({
          status: "error",
          error: "Datos incompletos o clave duplicada",
        });
    });
  */  

    /*
    it("TEST GET /api/products listar todos los productos, deberá responder código 200", async () => {
      const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
    });
    */

    /*
    it("TEST GET /api/products listar producto por id, deberá responder código 200", async () => {
      let pid = '664f47a765f03397c26e2489';
      const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}/${pid}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
      expect(_body).to.be.an('object');
    });
    */

    it("TEST GET /api/products listar producto por id, producto no existe, deberá responder código 404", async () => {
      let pid = '664f47a765f03397c26e2481';
      const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}/${pid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(404);
      expect(_body).to.be.an('object'); 
    });

  
});