const socket = io();

const form = document.getElementById('form-products');
const formProductoEliminar = document.getElementById('form-productsDelete');

const productos = document.getElementById('listaDeProducts');

if(form != null){
form.addEventListener('submit', (e) => {
    e.preventDefault();

    let title = this.document.querySelector("#title").value;
    let description = this.document.querySelector("#description").value;
    let price = this.document.querySelector("#price").value;
    let status = this.document.querySelector("#status").value;
    let stock = this.document.querySelector("#stock").value;
    let category = this.document.querySelector("#category").value;
    let ruta = "";


    let dato = {title, description, price, status, stock, category, ruta};
    socket.emit('crear_producto', dato);   

    this.document.getElementById("title").value = "";
    this.document.getElementById("description").value = "";
    this.document.getElementById("price").value = 0;
    this.document.getElementById("status").value = "";
    this.document.getElementById("stock").value = 0;
    this.document.getElementById("category").value = "";

})

}


if(formProductoEliminar != null){
formProductoEliminar.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let dato = this.document.querySelector("#input").value;
    socket.emit('eliminar_producto', dato);    
    this.document.getElementById("input").value = "";
})
}

//socket.on('tProducts', (data) => {
socket.on('todos', (data) => {

    console.log("Todos los Productos: ", data.productos);
    let p = "";
    data.productos.forEach(unP => {
       p+= `<tr>
                <td>${unP.id}</td>
                <td>${unP.title}</td>
                <td>${unP.description}</td>
                <td>${unP.price}</td>
                <td>${unP.stock}</td>
            </tr>`;  
    })
    if(productos != null)
        productos.innerHTML = p;
})