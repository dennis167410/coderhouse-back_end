const {Router} = require('express');
const listaDePets = require('../pets.json');

const router = Router();

const petsList=[
    {
        id:1,
        name: "Toby"
    },
    {
        id:2,
        name: "Firulais"
    },
    {
        id:3,
        name: "Boby"
    },
    {
        id:4,
        name: "Sonolento"
    },
];

router.get(`/`, (req, res) =>{
    return res.json({
      ok: true,
      pets: petsList,
    });  
  });


  // NO está terminado
// POST /api/users/
router.post(`/`, (req, res) => {
    const pet = req.body;
    console.log("pet = " + pet);
    const lastId = listaDePets.pets.length > 0 ? listaDePets.pets[listaDePets.pets.length-1].id += 1 : 1;
    const newPet = {
        id: lastId,
        ...pet
    };

    //listaUsuarios.usuarios.push(newUser);
   // usersList.push(newUser);
    res.json({ok: true, message: "Pet registrada.", pet: newPet});

})

module.exports = router;