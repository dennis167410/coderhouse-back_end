import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const CARTS_ROUTE = "/api/carts";

describe("Test funcional para los endpoints de Carrito", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    
    /*
    it("TEST POST /api/carts crear correctamente un carrito con productos, deberá retornar un codigo 200 ", async () => {   
        const bodyCarts = {
            products: [
                
                 {
                    id: "65d0331cd7671692a60e8138",
                    quantity: 1
                },
                {
                    id: "65d0e7f16672b15e8ba296f2",
                    quantity: 1
                }
               
            ]
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${CARTS_ROUTE}/todo`)
          .send(bodyCarts);
    
        expect(ok).to.be.true;
        expect(statusCode).to.eq(200);
      });
      

      it("TEST POST /api/carts no logra crear el carrito con productos, deberá retornar un codigo 400 ", async () => {   
        const bodyCarts = {
            products: [
                
                 {
                    id: "65d0331cd7671692a60e813",
                    quantity: 1
                },
                {
                    id: "65d0e7f16672b15e8ba296f",
                    quantity: 1
                }
               
            ]
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${CARTS_ROUTE}/todo`)
          .send(bodyCarts);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(400);
      });
      */

      it("TEST GET /api/carts listar carrito por id, deberá responder código 200", async () => {
        let cid = '65e68bf0989a77be6c6fec88';
        const { statusCode, ok, _body } = await requester.get(`${CARTS_ROUTE}/${cid}`);
    
        expect(ok).to.be.true;
        expect(statusCode).to.eq(200);
        expect(_body).to.be.an('object');
      });

      
      it("TEST GET /api/carts listar carrito por id, deberá responder código 404, carrito no existe", async () => {
        let cid = '65e75bc9d4e6282b59f19d3';
        const { statusCode, ok, _body } = await requester.get(`${CARTS_ROUTE}/${cid}`);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(404);
        expect(_body).to.be.an('object');
      });

});