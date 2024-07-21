import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos - UPDATE", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST PUT /api/products - Producto con error, el formato del id no es válido, deberá retornar código 500", async () => {
      let pid = '65d0331cd7671692a60e81';
      const bodyProduct = {
          title: "Producto 1 - superetest 1",
          description: "El producto 1 - supertest 1",
          code: "supertest1-prod1",
          price: 236,
          status: false,
          stock: 23,
          category: "cat3",
          thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"]
      };
  
      const { statusCode, ok, _body } = await requester
        .put(`${PRODUCTS_ROUTE}/${pid}`)
        .send(bodyProduct);
  
      expect(ok).to.be.false;
      expect(statusCode).to.eq(500);
  });

  it("TEST PUT /api/products - Producto no existe, deberá retornar código 400", async () => {
    let pid = '65d0331cd7671692a60e8133';
    const bodyProduct = {
        price: 700,
        stock: 1000
    };

    const { statusCode, ok, _body } = await requester
      .put(`${PRODUCTS_ROUTE}/${pid}`)
      .send(bodyProduct);

    expect(ok).to.be.false;
    expect(statusCode).to.eq(400);
});
 
it("TEST PUT /api/products - Producto existe, pero se envía texto en vez de un número, deberá retornar código 400", async () => {
  let pid = '65d0331cd7671692a60e8136';
  const bodyProduct = {
      price: "seisicentos"
  };

  const { statusCode, ok, _body } = await requester
    .put(`${PRODUCTS_ROUTE}/${pid}`)
    .send(bodyProduct);

  expect(ok).to.be.false;
  expect(statusCode).to.eq(400);
});

it("TEST PUT /api/products - Producto existe, pero el campo no existe, deberá retornar código 400", async () => {
  let pid = '65d0331cd7671692a60e8136';
  const bodyProduct = {
      costo: 1000
  };

  const { statusCode, ok, _body } = await requester
    .put(`${PRODUCTS_ROUTE}/${pid}`)
    .send(bodyProduct);

  expect(ok).to.be.false;
  expect(statusCode).to.eq(400);
});


  it("TEST PUT /api/products - Producto con datos correctos, deberá retornar código 200", async () => {
    let pid = '65d0331cd7671692a60e8136';
    const bodyProduct = {
        price: 700,
        stock: 1000
    };

    const { statusCode, ok, _body } = await requester
      .put(`${PRODUCTS_ROUTE}/${pid}`)
      .send(bodyProduct);

    expect(ok).to.be.true;
    expect(statusCode).to.eq(200);
});
  

});