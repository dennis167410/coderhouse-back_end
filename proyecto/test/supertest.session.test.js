import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const SESSION_ROUTE = "/api/session";

//video c21_p3 29:35
describe("Test funcional para los endpoints de session", () => {
    let requester = supertest(`${BASE_API_URL}`);  


    it("TEST POST /api/sesssion loggin correcto del usuario, deberá retornar un codigo 200 ", async () => {   
        const bodySession = {
            email: "sdo@gmail.com",
            password: "12345"
        };

    const { statusCode, ok, _body } = await requester
      .post(`${SESSION_ROUTE}/login`)
      .send(bodySession);
      expect(ok).to.be.true;
      expect(statusCode).to.eq(200);
  
    });


    it("TEST POST /api/sesssion loggin con error, contraseña incorrecta, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: "sdo@gmail.com",
            password: "123456"
        };

    const { statusCode, ok, _body } = await requester
     .post(`${SESSION_ROUTE}/login`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });


    it("TEST POST /api/sesssion loggin con error, email incorrecto, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: "sdo12@gmail.com",
            password: "12345"
        };

    const { statusCode, ok, _body } = await requester
     .post(`${SESSION_ROUTE}/login`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
    });


    it("TEST POST /api/sesssion loggin con error, constraseña y/o email vacíos, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: "",
            password: "12345"
        };

    const { statusCode, ok, _body } = await requester
     .post(`${SESSION_ROUTE}/login`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });

    /*
    it("TEST POST /api/session registra un usuario correctamente, deberá retornar el código 200", async () => {
        const bodySession = {
            first_name: "supertest_2",
            last_name: "supertest_2",
            email: "supertest2@gmail.com",
            age: 42,
            password: "12345",
            role: "PREMIUM"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.true;
        expect(statusCode).to.eq(200);
    });
    */
        
    it("TEST POST /api/session error al registrar un usuario no se ingresó el email, deberá retornar el código 400", async () => {
        const bodySession = {
            first_name: "supertest_2",
            last_name: "supertest_2",
            email: "",
            age: 42,
            password: "12345",
            role: "PREMIUM"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(400);        

    });

    it("TEST POST /api/session error al registrar un usuario, el email y está registrado, deberá retornar el código 404", async () => {
        const bodySession = {
            first_name: "supertest_1",
            last_name: "supertest_1",
            email: "supertest1@gmail.com",
            age: 42,
            password: "",
            role: "PREMIUM"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(404);        

    });

});