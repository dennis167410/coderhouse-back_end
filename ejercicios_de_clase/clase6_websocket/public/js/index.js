
// INICIAMOS LA CONEXIÓN POR PARTE DEL CLIENTE:
const socket = io();

const form = document.getElementById('form-msg');
const mensaje = document.getElementById('all-mensajes');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form[0];
    if(!input.value.trim().length) return;
    socket.emit('new-msg', input.value); 
    input.value = "";
})

socket.on('msg-logs', (data)=>{
    if(!data.length) return;
    let logs = "";
    data.forEach(msg =>{
        logs += `<p>socketid: ${msg.socketid}, mensaje: ${msg.message}</p>` 
    });

    mensaje.innerHTML = logs;
})

/*const txtMensaje = document.getElementById('txtMensaje');
const mensaje = document.getElementById('mensaje');

txtMensaje.addEventListener('keydown', (e)=>{
    const { key } = e;
    if(key.length === 1 || key === 'Backspace')
        socket.emit('char', key)
})

socket.on('msg', (data) =>{
    mensaje.innerText= data;
})*/

// socket.emit(NOMBRE_DEL_EVENTO, nuevo mensaje)
/*socket.emit('nuevo-mensaje', "Hola desde el front");

 // socket.on() escuchamos un evento.
 socket.on('nuevo-mensaje', (data) => {
    console.log(`Nuevo mensaje desde el servidor: \n >${data}`)
});

socket.on('mensaje_para_todos_menos_al_socket_actual', (data) => {
    console.log(`Nuevo mensaje desde el servidor: \n >${data}`)
});

socket.on('evento-para-todos', (data) => {
    console.log(`Nuevo mensaje desde el servidor: \n >${data}`)
})
*/