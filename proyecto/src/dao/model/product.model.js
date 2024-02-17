const mongoose = require ('mongoose');

const collectionName = 'products';

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    code: {
        type:String,
        required: true,
        //unique: true    
    },
    price:{
        type:Number,
         required: true  
    },
    status: {
        type:Boolean,
        required: true  
    },
    stock:{
        type:Number,
        required: true  
    },
    category:{
        type:String,
        required: true
        // enum: ["A","B"]  
    },
    thumbnails:{
        type: Array,
        //required: false  
    }
    
});

const productModel = mongoose.model(collectionName, productSchema);

module.exports = productModel;