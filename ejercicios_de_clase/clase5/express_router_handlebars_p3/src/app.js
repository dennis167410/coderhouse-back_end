const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const usersRoutes = require('./routes/users.routes');
const petsRoutes = require('./routes/pets.routes');

const app = express();
const PORT = 5000;
const API_PREFIX = "api";

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const users=[
    {
        id: 1,
        name: "Julia",
        lastname: "Martinez",
        age: 33
    },
    {
        id: 2,
        name: "Magali",
        lastname: "Paz",
        age: 29
    },
    {
        id: 3,
        name: "Paula",
        lastname: "Borges",
        age: 43
    },
];


//Configuración handlebars:
app.engine("handlebars", handlebars.engine());
app.set('views', path.join(`${__dirname}/views`));
app.set("view engine", "handlebars");

//console.log(__dirname + '/../public')
app.use('/static', express.static(__dirname + '/public'));
//app.use(express.static('public'));


// USERS ROUTES
// /api/users
app.use(`/${API_PREFIX}/users`, usersRoutes);

// PETS ROUTES
// /api/pets
app.use(`/${API_PREFIX}/pets`, petsRoutes);


// views handlebars engine:
app.get('/saludar', (req, res) => {
    const randomUser = Math.ceil(Math.random()*users.length)
    const userRender = users[randomUser];
    res.render('index', {name: userRender.name})
})


app.listen(PORT, () =>{
    console.log("UP AND RUNNING ON PORT = " + PORT);
})