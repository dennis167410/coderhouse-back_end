import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos - DEELTE", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST DELETE /api/products - Producto con error, no se ingresó el título. Deberá retornar 404 ", async () => {
     
  });

      
});