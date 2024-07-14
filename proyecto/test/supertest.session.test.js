import { expect } from "chai";
import supertest from "supertest";

const BASE_API_URL = "http://localhost:8080";
const SESSION_ROUTE = "/api/session";

//video c21_p3 29:35
describe("Test funcional para los endpoints de session", () => {
    let requester = supertest(`${BASE_API_URL}`);  

    // LOGIN - Usuario No registrado, datos nulos o vacíos.
    it("TEST LOGIN - SIN REGISTRARSE - POST /api/sesssion usuario NO registrado, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: "sdo@gmail.com",
            password: "12345"
        };

    const { statusCode, ok, _body } = await requester
      .post(`${SESSION_ROUTE}/login`)
      .send(bodySession);
      console.log(ok)
      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
    });


    it("TEST POST /api/sesssion loggin con error, NO se ingresó contraseña, deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: "sdo@gmail.com",
            password: ""
        };

    const { statusCode, ok, _body } = await requester
     .post(`${SESSION_ROUTE}/login`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });

    it("TEST POST /api/sesssion loggin con error, NO se ingresó email, deberá retornar un codigo 400 ", async () => {   
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

    it("TEST POST /api/sesssion loggin con error, NO se ingresó email (null), deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: null,
            password: "12345"
        };

    const { statusCode, ok, _body } = await requester
     .post(`${SESSION_ROUTE}/login`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });

    it("TEST POST /api/sesssion loggin con error, NO se ingresó constraseña (null), deberá retornar un codigo 400 ", async () => {   
        const bodySession = {
            email: "sdo@gmail.com",
            password: null
        };

    const { statusCode, ok, _body } = await requester
     .post(`${SESSION_ROUTE}/login`)
     .send(bodySession);

      expect(ok).to.be.false;
      expect(statusCode).to.eq(400);
  
    });

    //REGISTRAR 
    it("TEST POST /api/session error al registrar un usuario NO se ingresó el email, deberá retornar el código 400", async () => {
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

    it("TEST POST /api/session error al registrar un usuario NO se ingresó el contraseña, deberá retornar el código 400", async () => {
        const bodySession = {
            first_name: "supertest_2",
            last_name: "supertest_2",
            email: "sdo@gmail.com",
            age: 42,
            password: "",
            role: "PREMIUM"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(400);        

    });

    it("TEST POST /api/session error al registrar un usuario NO se ingresó el rol, deberá retornar el código 400", async () => {
        const bodySession = {
            first_name: "supertest_2",
            last_name: "supertest_2",
            email: "sdo@gmail.com",
            age: 42,
            password: "12345",
            role: ""
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(400);        

    });

    it("TEST POST /api/session error al registrar un usuario se ingresó rol NO incluido en la lista, deberá retornar el código 400", async () => {
        const bodySession = {
            first_name: "supertest_2",
            last_name: "supertest_2",
            email: "sdo@gmail.com",
            age: 42,
            password: "12345",
            role: "MEMBER"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(400);        

    });

    it("TEST POST /api/session registra un usuario correctamente, deberá retornar el código 200", async () => {
        const bodySession = {
            first_name: "supertest_1",
            last_name: "supertest_1",
            email: "sdo@gmail.com",
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
    

    it("TEST POST /api/session error al registrar un usuario, el email y está registrado, deberá retornar el código 404", async () => {
        const bodySession = {
            first_name: "supertest_1",
            last_name: "supertest_1",
            email: "sdo@gmail.com",
            age: 42,
            password: "12345",
            role: "PREMIUM"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(404);        

    });

    it("TEST POST /api/session registro con edad inválida, deberá retornar un código 404", async () => {
        const bodySession = {
            first_name: "supertest_2",
            last_name: "supertest_2",
            email: "sdo@gmail.com",
            age: "invalid_age",
            password: "12345",
            role: "PREMIUM"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/register`)
          .send(bodySession);
    
        expect(ok).to.be.false;
        expect(statusCode).to.eq(404);        
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
   
    
    it("TEST POST /api/session login con campos adicionale, deberá retornar un código 400", async () => {
        const bodySession = {
            email: "sdo@gmail.com",
            password: "12345",
            extraField: "extraValue"
        };
    
        const { statusCode, ok, _body } = await requester
          .post(`${SESSION_ROUTE}/login`)
          .send(bodySession);
    
        expect(ok).to.be.true;
        expect(statusCode).to.eq(200);
    });

});