import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST GET /api/products listar todos los productos, deberá responder código 200", async () => {
      const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
    });
    

    it("TEST GET /api/products listar producto por id, deberá responder código 200", async () => {
      let pid = '65d0331cd7671692a60e8136';
      const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}/${pid}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
      expect(_body).to.be.an('object');
    });
    

    
    it("TEST GET /api/products listar producto por id, producto no existe, deberá responder código 404", async () => {
      let pid = '664f47a765f03397c26e2481';
      const { statusCode, ok, _body } = await requester.get(`${PRODUCTS_ROUTE}/${pid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(404);
      expect(_body).to.be.an('object'); 
    });
  
  
});