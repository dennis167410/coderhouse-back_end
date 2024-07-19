import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos - UPDATE", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST PUT /api/products - Producto con error, no se ingresó el título. Deberá retornar 404 ", async () => {
      const bodyProduct = {
          description: "El producto 1 - supertest 1",
          code: "supertest1-prod1",
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
  });

      
});