const mongoose = require ('mongoose');

const collectionName = 'producto';

const pruebaSchema = mongoose.Schema({
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
       // unique: true    
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
    },
    thumbnails:{
        type: Array,
        //required: false  
    }
    
});

const pruebaModel = mongoose.model(collectionName, pruebaSchema);

module.exports = pruebaModel;