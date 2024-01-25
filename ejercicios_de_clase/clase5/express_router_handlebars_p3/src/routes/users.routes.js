const {Router} = require('express');
const listaUsuarios = require('../users.json');

const router = Router();

//const usersList = listaUsuarios;

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
        id: 2,
        name: "Paula",
        lastname: "Borges",
        age: 43
    },
];

// GET /api/users/
router.get(`/`, (req, res) =>{
    return res.json({
      ok: true,
      users: listaUsuarios.usuarios,//usersList,
    });  
  });
 


module.exports = router;