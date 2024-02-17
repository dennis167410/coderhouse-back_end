//const ProductManager = require('./entidad/ProductManager.js');

const messageModel = require('./model/message.model.js');


const mensajes = [];

module.exports = (io) => {
    io.on("connection", async (socket) => {

        console.log("Nueva conexión ", socket.id);

        socket.on('mensaje', (data) => {
            const m = {
               // user: socket.id,
                user: data.email,
                message: data.input
            }
                   
            mensajes.push(m);
           
            messageModel.insertMany(m);

            io.emit("mensajes", mensajes);       
        })
 
        socket.on("nuevo-usuario", (data) => {
            socket.broadcast.emit("nuevo-usuario",data)
        })

        /*
        const pm = new ProductManager();
        socket.emit("todos", await pm.getProducts());
        */

        /*
        socket.on("crear_producto", async (data) => {
            console.log(data);
            await pm.addProduct(data)
            io.emit("todos", await pm.getProducts());
        })
        */    
        
        /*
        socket.on('eliminar_producto', async (data) => {
            let resp = await pm.deleteProduct(Number(data));
            console.log(resp);          
        }) */

    })
};