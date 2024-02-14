const ProductManager = require('./entidad/ProductManager.js');

module.exports = (io) => {
    io.on("connection", async (socket) => {
        const pm = new ProductManager();
        console.log("Nueva conexión ", socket.id);

       // socket.emit("tProducts", await pm.getProducts());
        socket.emit("todos", await pm.getProducts());



        socket.on("crear_producto", async (data) => {
            console.log(data);
            await pm.addProduct(data)
          ////  io.emit("tProducts", await pm.getProducts())
            io.emit("todos", await pm.getProducts());
        })    
        
        socket.on('eliminar_producto', async (data) => {
            let resp = await pm.deleteProduct(Number(data));
            console.log(resp);          
        })

    })
};