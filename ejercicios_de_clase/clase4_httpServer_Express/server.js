const express = require("express");
const users = require("./users.json");

const PORT = 6500;

const app = express();

app.get("/", (request, response) => {
    response.send("API ALIVE " + PORT);
});

app.get("/saludar", (request, response) => {
    response.send("API ALIVE HOLLA" + PORT);
});


app.get("/usuario", (request, response) => {
    const user = users.usuarios[1];
    response.json({message: "respondiendo un usuario ", user});
});

app.listen(PORT, () => {
    console.log("SERVER UP AND RUNING")
})