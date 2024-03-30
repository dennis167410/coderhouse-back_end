const mongoose = require ('mongoose');

const collectionName = 'carts';

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true
                
                }
            },
            
        ],

        defult: []
    }

    });

// Para usar el middleware de mongoose por default:
cartSchema.pre('find', function(){
    this.populate('products.product')
});


const cartModel = mongoose.model(collectionName, cartSchema);

module.exports = cartModel;