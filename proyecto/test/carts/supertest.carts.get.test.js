import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const CARTS_ROUTE = "/api/carts";

describe("Test funcional para los endpoints de Carritos - GET", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST GET /api/carts listar todos los carritos, deberá responder código 200", async () => {
      const { statusCode, ok, _body } = await requester.get(`${CARTS_ROUTE}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
    });
    
    
    it("TEST GET /api/carts listar carritos por id, deberá responder código 200", async () => {
      let cid = '6686316f3fe5481c3c6914c1';
      const { statusCode, ok, _body } = await requester.get(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
      expect(_body).to.be.an('object');
    });
    

    
    it("TEST GET /api/carts listar carritos por id, carrito no existe, deberá responder código 404", async () => {
      let cid = '664f47a765f03397c26e2481';
      const { statusCode, ok, _body } = await requester.get(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(404);
     
    });
    
  
    it("TEST GET /api/carts listar carrito por id, formato del id no es válido, deberá responder código 500", async () => {
      let cid = '664f47a765f03397c26e24';
  
      const { statusCode, ok, _body } = await requester.get(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(500);
    });
  
});