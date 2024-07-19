import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const PRODUCTS_ROUTE = "/api/products";

describe("Test funcional para los endpoints de Productos - POST", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST POST /api/products - Producto con error, no se ingresó el título. Deberá retornar 404 ", async () => {
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

  it("TEST POST /api/products - Producto con error, no se ingresó el descripción. Deberá retornar 404 ", async () => {
    const bodyProduct = {
        title: "Producto 1 -15 de julio - supertest 1",
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

    it("TEST POST /api/products - Producto con error, no se ingresó el código. Deberá retornar 404 ", async () => {
      const bodyProduct = {
          title: "Producto 1 -15 de julio - supertest 1",
          description: "El producto 1 - 15 de julio - supertest 1",
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

  it("TEST POST /api/products - Producto con error, no se ingresó el precio. Deberá retornar 404 ", async () => {
    const bodyProduct = {
        title: "Producto 1 -15 de julio - supertest 1",
        description: "El producto 1 - 15 de julio - supertest 1",
        code: "assa22",
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

it("TEST POST /api/products - Producto con error, no se ingresó el stock. Deberá retornar 404 ", async () => {
  const bodyProduct = {
      title: "Producto 1 -15 de julio - supertest 1",
      description: "El producto 1 - 15 de julio - supertest 1",
      code: "assa22",
      price: 120,
      status: false,
      category: "cat3",
      thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"]
  };

  const { statusCode, ok, _body } = await requester
    .post(`${PRODUCTS_ROUTE}`)
    .send(bodyProduct);

  expect(ok).to.be.false;
  expect(statusCode).to.eq(404);
});

it("TEST POST /api/products - Producto con error, no se ingresó la categoría. Deberá retornar 404 ", async () => {
  const bodyProduct = {
      title: "Producto 1 -15 de julio - supertest 1",
      description: "El producto 1 - 15 de julio - supertest 1",
      code: "assa22",
      price: 120,
      status: false,
      stock:2000,
      thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"]
  };

  const { statusCode, ok, _body } = await requester
    .post(`${PRODUCTS_ROUTE}`)
    .send(bodyProduct);

  expect(ok).to.be.false;
  expect(statusCode).to.eq(404);
});

it("TEST POST /api/products, Producto con error, el dueño no es Premuim no Admin, deberá retornar código 500", async () => {   
           
  const fecha = Date.now();

  const bodyProduct = {
      title: "Producto 1 "+ fecha.toString() +" - supertest",
      description: "El producto 1 - " + fecha.toString() + " supertest",
      code: "code_"+fecha.toString(),
      price: 236,
      status: true,
      stock: 23,
      category: "cat3",
      thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"],
      owner: "user@gmail.com"
  };

  const { statusCode, ok, _body } = await requester
    .post(`${PRODUCTS_ROUTE}`)
    .send(bodyProduct);

  expect(ok).to.be.true;
  expect(statusCode).to.eq(500);
  expect(_body.message).to.have.property("_id");
});

/*
it("TEST POST /api/products, Producto con error, el dueño no está en la lista, deberá retornar código 500", async () => {   
           
  const fecha = Date.now();

  const bodyProduct = {
      title: "Producto 1 "+ fecha.toString() +" - supertest",
      description: "El producto 1 - " + fecha.toString() + " supertest",
      code: "code_"+fecha.toString(),
      price: 236,
      status: true,
      stock: 23,
      category: "cat3",
      thumbnails: ["img/product4_1.jpg", "img/product4_2.jpg"],
      owner: "member@gmail.com"
  };

  const { statusCode, ok, _body } = await requester
    .post(`${PRODUCTS_ROUTE}`)
    .send(bodyProduct);

    expect(ok).to.be.true;
    expect(statusCode).to.eq(500);
    expect(_body.message).to.have.property("_id");
  });
*/

  it("TEST POST /api/products crear correctamente un producto con codigo 200 ", async () => {   
           
        const fecha = Date.now();

        const bodyProduct = {
            title: "Producto 1 "+ fecha.toString() +" - supertest",
            description: "El producto 1 - " + fecha.toString() + " supertest",
            code: "code_"+fecha.toString(),
            price: 236,
            status: true,
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
      
});