const mongoose = require ('mongoose');

const collectionName = 'messages';

const messageSchema = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    }
    
});

const messageModel = mongoose.model(collectionName, messageSchema);

module.exports = messageModel;