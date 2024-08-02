import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const CARTS_ROUTE = "/api/carts";

describe("Test funcional para los endpoints de Productos - POST", () => {
    let requester = supertest(`${BASE_API_URL}`);  
    
    it("TEST POST /api/carts - Cart con error, el formato del id de los productos no son válido, deberá retornar código 400", async () => {
      
    const bodyCart= [
      {
          id: "668619c98e7e75844d24912",
          quantity: 24
      },
      {
          id: "668619da8e7e75844d24913",
          quantity: 1
      }
    ]

    const { statusCode, ok, _body } = await requester
    .post(`${CARTS_ROUTE}/todo`)
    .send({ products: bodyCart });

    //console.log(statusCode + " body = " +_body)

    expect(ok).to.be.false;     
    expect(statusCode).to.eq(500);
  });

  
  it("TEST POST /api/carts - Cart con error, la cantidad de los productos son negativa, deberá retornar código 400", async () => {
          
    const bodyCart= [
      {
          id: "668619da8e7e75844d249133",
          quantity: -1
      },
      {
          id: "668619938e7e75844d249128",
          quantity: -2
      }
    ]

    const { statusCode, ok, _body } = await requester
    .post(`${CARTS_ROUTE}/todo`)
    .send({ products: bodyCart });

    console.log(statusCode + " body = " +_body)
    expect(ok).to.be.false; 
    expect(statusCode).to.eq(400);
  });



 it("TEST POST /api/carts - Cart un error de cantidad, la cantidad de uno de los productos es negativa, deberá agregar el que corresponda, deberá retornar código 200", async () => {
          
    const bodyCart= [
      {
          id: "668619da8e7e75844d249133",
          quantity: -1
      },
      {
          id: "668619938e7e75844d249128",
          quantity: 2
      }
    ]

    const { statusCode, ok, _body } = await requester
    .post(`${CARTS_ROUTE}/todo`)
    .send({ products: bodyCart });

    console.log(statusCode + " body = " +_body)
    expect(ok).to.be.true; 
    expect(statusCode).to.eq(200);
  });


  it("TEST POST /api/carts - Cart con error, el producto o los productos no existe, deberá retornar código 400", async () => {
    const bodyCart= [
      {
          id: "668619938e7e75844d249122",
          quantity: 1
      },
      {
          id: "668619938e7e75844d249129",
          quantity: 2
      }
    ]

    const { statusCode, ok, _body } = await requester
    .post(`${CARTS_ROUTE}/todo`)
    .send({ products: bodyCart });

    expect(ok).to.be.false; 
    expect(statusCode).to.eq(400);
    
  });

  
  it("TEST POST /api/carts - Cart creado correctamente, deberá retornar código 200", async () => {
  
    const bodyCart= [
      {
          id: "668619da8e7e75844d249133",
          quantity: 3
      },
      {
          id: "668619938e7e75844d249128",
          quantity: 2
      }
    ]

    const { statusCode, ok, _body } = await requester
    .post(`${CARTS_ROUTE}/todo`)
    .send({ products: bodyCart });

    console.log(statusCode + " body = " +_body)
    expect(ok).to.be.true; 
    expect(statusCode).to.eq(200);

  });


});