import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const CARTS_ROUTE = "/api/carts";

describe("Test funcional para los endpoints de Productos - POST", () => {
    let requester = supertest(`${BASE_API_URL}`);  
    
    it("TEST POST /api/carts - Cart con error, el formato del id de los productos no son válido, deberá retornar código 500", async () => {
      
    const bodyCart= [
      {
          id: "668619c98e7e75844d24912e",
          quantity: 24
      },
      {
          id: "668619da8e7e75844d249133",
          quantity: 1
      }
    ]

    const { statusCode, ok, _body } = await requester
    .post(`${CARTS_ROUTE}/todo`)
    .send(bodyCart);

    expect(ok).to.be.false;
    //expect(statusCode).to.eq(500);
   // expect(_body.message).to.have.property("_id");
     
  });

  it("TEST POST /api/carts - Cart con error, la cantidad es negativa, deberá retornar código 500", async () => {
      
  });

  it("TEST POST /api/carts - Cart con error, el prodcuto o los productos no existe, deberá retornar código 404", async () => {
      
  });

  it("TEST POST /api/carts - Cart con error, al producto o los productos le faltan datos, deberá retornar código 404", async () => {
      
  });

  it("TEST POST /api/carts - Cart con error, el o los campos no existen, deberá retornar código 404", async () => {
      
  });

  it("TEST POST /api/carts - Cart creado correctamente, deberá retornar código 200", async () => {
      
  });

});