const mongoose = require ('mongoose');

const collectionName = 'carts';



const cartSchema = mongoose.Schema({
    products: {
        type: Array,
        id: {
            required: true,
         },
        quantity: {
            type: Number,
            required: true
        }
    }

    });

const cartModel = mongoose.model(collectionName, cartSchema);

module.exports = cartModel;