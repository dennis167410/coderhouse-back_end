import { login } from "./auth.login.js";

// Para ejecutrar : npm run test proyecto/src/mocking/auth.login.spec.js
// o
// npm run test:watch -> ejecutará las pruebas para todos los archivos .spec.
const user = {
  name: "coderUser",
  password: "123",
};

const isAuth = login(null, user.password);
console.log("isAuth:", isAuth);
//let isAuth2 = login(user.name, null);
//console.log("isAuth:", isAuth2);
//let isAuth3 = login(null, null);
//console.log("isAuth:", isAuth3);
//let isAuth4 = login(user.name, user.password);
//console.log("isAuth:", isAuth4);