import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos - DELETE", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    /*
    it("TEST DELETE /api/products - Producto con error, el formato del id no es válido, deberá retornar código 500", async () => {
      let pid = '65d0331cd7671692a60e81';
     
      const { statusCode, ok} = await requester
        .delete(`${PRODUCTS_ROUTE}/${pid}`)
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(500);
  });
*/

  it("TEST DELETE /api/products - Producto no existe, deberá retornar código 404", async () => {
      let pid = '65d0331cd7671692a60e8133';
      
      const { statusCode, ok} = await requester.delete(`${PRODUCTS_ROUTE}/${pid}`);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(404);
  });

  it("TEST DELETE /api/products - Producto existe, pero el usuario logueado no es el dueño, deberá retornar código 401", async () => {
    let pid = '65d0331cd7671692a60e8136';
   
    // Para el test, el usuer y el rol lo cargue en product.controller.js
  
   // const { statusCode, ok} = await requester.delete(`${PRODUCTS_ROUTE}/${pid}`);

   // expect(ok).to.be.false;
   // expect(statusCode).to.eq(401);

  });

  
    it("TEST DELETE /api/products - Producto eliminado correctamente, deberá retornar código 200", async () => {
      let pid = '65d0331cd7671692a60e8136';
      
      const { statusCode, ok} = await requester.delete(`${PRODUCTS_ROUTE}/${pid}`);
  
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
    });




});