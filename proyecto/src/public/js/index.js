/*const form = document.getElementById('form-msg');
const mensaje = document.getElementById('all-mensajes');
*/
console.log("Hola, websocket para el proyecto, de la vista que debe ser")

const socket = io();


const form = document.getElementById('form-products');
const formProductoEliminar = document.getElementById('form-productsDelete');
const productos = document.getElementById('listaDeProducts');


form.addEventListener('submit', (e) => {
    e.preventDefault();

    let title = this.document.querySelector("#title").value;
    let description = this.document.querySelector("#description").value;
    let price = this.document.querySelector("#price").value;
    let status = this.document.querySelector("#status").value;
    let stock = this.document.querySelector("#stock").value;
    let category = this.document.querySelector("#category").value;
    let ruta = this.document.querySelector("#ruta").value;

    console.log(title);
    console.log(description);
    console.log(price);
    console.log(status);
    console.log(stock);
    console.log(category);
    console.log(ruta);

    let dato = {title, description, price, status, stock, category, ruta};
    socket.emit('crear_producto', dato);   

})



formProductoEliminar.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let dato = this.document.querySelector("#input").value;
    socket.emit('eliminar_producto', dato);    
})


socket.on("todos", (data) => {
    console.log("Todos los Productos: ", data);

})

socket.on('tProducts', (data) => {
    let p = "";
    data.forEach(unP => {
       p+= `<tr>
                <td>${unP.id}</td>
                <td>${unP.title}</td>
                <td>${unP.description}</td>
                <td>${unP.price}</td>
                <td>${unP.stock}</td>
            </tr>`;  
    })
    productos.innerHTML = p;
})