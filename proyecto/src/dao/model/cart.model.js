import mongoose from 'mongoose';

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

        default: []
    }

    });

// Para usar el middleware de mongoose por default:
cartSchema.pre('find', function(){
    this.populate('products.product')
});


const cartModel = mongoose.model(collectionName, cartSchema);

export default cartModel;