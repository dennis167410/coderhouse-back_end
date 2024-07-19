import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const SESSION_ROUTE = "/api/session";

describe("Test funcional para los endpoints de session - POST", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    it("TEST POST /api/sesssion recovery password con error, NO se ingresó email, contraseña ni token, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            new_password:"", 
            email:"", 
            token:""
        };

    const { statusCode, ok} = await requester
     .post(`${SESSION_ROUTE}/recover-psw`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });

    it("TEST POST /api/sesssion recovery password con error, NO se ingresó contraseña ni token, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            new_password:"", 
            email:"sdo@gmail.com", 
            token:""
        };

    const { statusCode, ok} = await requester
     .post(`${SESSION_ROUTE}/recover-psw`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });
   

    it("TEST POST /api/sesssion recovery password con error, NO se ingresó token, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            new_password:"12345", 
            email:"sdo@gmail.com", 
            token:""
    };

    const { statusCode, ok} = await requester
     .post(`${SESSION_ROUTE}/recover-psw`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });
   
    it("TEST POST /api/sesssion recovery ok, deberá retornar un codigo 200 ", async () => {   
        const bodySession = {
            new_password:"123", 
            email:"sdo@gmail.com", 
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJEdG8iOnsiZmlyc3RfbmFtZSI6InN1cGVydGVzdF8xIiwiZW1haWwiOiJzZG9AZ21haWwuY29tIiwicm9sZSI6IlBSRU1JVU0iLCJjYXJ0cyI6W119fSwiaWF0IjoxNzIxMDA0NTUwLCJleHAiOjE3MjEwMDYzNTB9.5jCcjOJi43iu7Gx-zvWfLS3E6HUvYdxlblO5Tw0MFFg"
        };

    const { statusCode, ok} = await requester
     .post(`${SESSION_ROUTE}/recover-psw`)
     .send(bodySession);
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
  
    });

    });