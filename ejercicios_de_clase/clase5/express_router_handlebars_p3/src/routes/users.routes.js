const {Router} = require('express');
const listaUsuarios = require('../users.json');

const router = Router();

//const usersList = listaUsuarios;

/*const usersList=[
    {
        id:1,
        name: "Julia"
    },
    {
        id:2,
        name: "Anto"
    },
    {
        id:3,
        name: "Paula"
    },
];*/

// GET /api/users/
router.get(`/`, (req, res) =>{
    return res.json({
      ok: true,
      users: listaUsuarios.usuarios,//usersList,
    });  
  });
  
// GET /api/users/1
router.get(`/:userId`, (req, res) =>{
   console.log("PARAMS = " + req.params);
   
   const userId = req.params.userId;

   if(isNaN(userId)){
        return res.status(400).json({
            ok: true,
            message: `No existe el usuario con el id ${userId}.`,
            queryParams: req.query,
        });
   }

   const usuario = listaUsuarios.usuarios.find((u) => {
        return u.id === Number(userId);
   });

   if(!usuario){
    return res.status(400).json({
        ok: true,
        message: `No existe el usuario con el id ${userId}.`,
        usuario,
        queryParams: req.query,
    });
   }

   return res.json({
    ok: true,
    message:  `Encontrado el usuario con el id ${userId}.`,
    usuario
 }); 

});


// NO está terminado
// POST /api/users/
router.post(`/`, (req, res) => {
    const user = req.body;
    console.log("user = " + user);
    const lastId = listaUsuarios.usuarios.length > 0 ? listaUsuarios.usuarios[listaUsuarios.usuarios.length-1].id += 1 : 1;
    const newUser = {
        id: lastId,
        ...user
    };

    //listaUsuarios.usuarios.push(newUser);
   // usersList.push(newUser);
    res.json({ok: true, message: "Usuario registrado.", usuario: newUser});
})

// PUT /api/users/1
router.put(`/:userId`, (req, res) => {

})

// DELETE /api/users/1
router.delete(`/:userId`, (req, res) => {

})


module.exports = router;