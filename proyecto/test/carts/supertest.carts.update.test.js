import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const CARTS_ROUTE = "/api/carts";

describe("Test funcional para los endpoints de Carritos - UPDATE", () => {
    let requester = supertest(`${BASE_API_URL}`);  
   

    /*  Deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body.
        Si el producto no existe le agrega el producto con la cantidad, de lo contrario incrementa su cantidad.
    */
    it("TEST UPDATE /api/carts Error,  formato del id no es válido, deberá retornar código 500", async () => {
      let cid = '66acd2e816c8d336775052b';
      const { statusCode, ok, _body } = await requester.put(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(500);
    
    });


    it("TEST DELETE /api/carts Error, el carrito no existe, deberá responder código 400", async () => {
      let cid = '66acd2e816c8d336775052b3';
      const { statusCode, ok, _body } = await requester.delete(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
    
    });

    
  

});