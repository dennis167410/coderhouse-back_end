import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const CARTS_ROUTE = "/api/carts";

describe("Test funcional para los endpoints de Carritos - DELETE", () => {
    let requester = supertest(`${BASE_API_URL}`);  
   

    it("TEST DELETE /api/carts Error,  formato del id no es válido, deberá responder código 500", async () => {
      let cid = '66acd2e816c8d336775052b';
      const { statusCode, ok, _body } = await requester.delete(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(500);
    
    });


    it("TEST DELETE /api/carts Error, el carrito no existe, deberá responder código 400", async () => {
      let cid = '66acd2e816c8d336775052b3';
      const { statusCode, ok, _body } = await requester.delete(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
    
    });

  /*  
    it("TEST DELETE /api/carts Elimina todos los productos del carrito seleccionado, deberá responder código 200", async () => {
      let cid = '66acd2e816c8d336775052b9';
      const { statusCode, ok, _body } = await requester.delete(`${CARTS_ROUTE}/${cid}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
    
    });
    */
  
    /* -------------------------------------------------------- */
    // Deberá eliminar del carrito el producto seleccionado - deleteCart.

    it("TEST DELETE /api/carts Elimina del carrito el producto seleccionado, deberá responder código 200", async () => {
      let cid = '6686ae35ea75217346a0772c';
      let pid = '668619938e7e75844d249128';

      const { statusCode, ok, _body } = await requester.delete(`${CARTS_ROUTE}/${cid}/products/${pid}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
    
    });

    it("TEST DELETE /api/carts,  Error al intentar eliminar del carrito el producto seleccionado, id del producto no es válido, deberá responder código 500", async () => {
      let cid = '65d0331cd7671692a60e81';  
      let pid = '65d0331cd7671692a60e81';  

     });

     it("TEST DELETE /api/carts,  Error al intentar eliminar del carrito el producto seleccionado, id del producto no existe, deberá responder código 400", async () => {
      let cid = '65d0331cd7671692a60e81';  
      let pid = '65d0331cd7671692a60e81';  
     

     });

     it("TEST DELETE /api/carts, Ok, Se logró eliminar del carrito el producto seleccionado, deberá responder código 200", async () => {
      let cid = '65d0331cd7671692a60e81';  
      let pid = '65d0331cd7671692a60e81';  
     
     });
});