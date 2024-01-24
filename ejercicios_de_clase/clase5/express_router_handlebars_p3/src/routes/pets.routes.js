const {Router} = require('express');
//const listaDePets = require('../pets.json');
const { uploader } = require('../utils');

const router = Router();

const petsList = [];
/*const petsList=[
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
];*/

router.get(`/`, (req, res) =>{
    return res.json({
      ok: true,
      pets: petsList,
    });  
  });


  // NO está terminado
// POST /api/users/
router.post(`/`, uploader.single('thumbnail'), (req, res) => {
    const file = req.file;
    //console.log("Archivo: " + file.originalname);

    if(!file){
        return res.status(400).send({message: 'No se pudo subir el archivo.'});
    }

    const newPet = req.body;
    console.log("pet = ", newPet);
    const lastId = petsList.length > 0 ? petsList[petsList.length-1]-id + 1 : 1;
    newPet.thumbnail = `http://localhost:5000/public/uploads/${file.filename}`
    petsList.push({id: lastId, ...newPet});
    
    res.json({ok: true, message: "Pet registrada.", pet: newPet});

});

module.exports = router;