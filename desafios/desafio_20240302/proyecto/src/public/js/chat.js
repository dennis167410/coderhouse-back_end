const socket = io();

let email;


function validarEmail(email) {
  // Expresión regular para validar el mail:
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
}

Swal.fire({
  title: "Ingrese su mail, ej.: pepe@mail.com",
  input: "text",
  text: "¡Ingrese su mail para identificarse en el chat!",
  inputValidator: (value) => {
    if (validarEmail(value)) {
      return ;
    } else {
      return "Debe ingresar su mail para continuar.";
    }
  },
  allowOutsideClick: false
}).then((result) =>{
email = result.value;
socket.emit("nuevo-usuario", email)
}
)

socket.on("nuevo-usuario", (data) => {
  if(!email) return;
  Swal.fire({
    text: `${data} se unio al chat.`,
    toast: true,
    position: "top-right"
  })
})

const form = document.getElementById('form-message');
const message = document.getElementById("message");


if(form != null){
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let input = this.document.querySelector("#input").value;
      
        let dato = {email, input};
        socket.emit('mensaje', dato);   

    this.document.getElementById("input").value = "";
    });
}

socket.on("mensajes", (data) => {
  if(!email) return;
  if(!data.length) return;
  let logs="";

  data.forEach(msg => {
    logs += `<p>email: ${msg.user} mensaje: ${msg.message} </p>`
  })
     message.innerHTML = logs;    
 });



