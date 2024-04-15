
//const messageModel = require('./dao/model/message.model.js');
import messageModel from './dao/model/message.model.js';

const mensajes = [];

/*module.exports*/ export default (io) => {
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
    })
};