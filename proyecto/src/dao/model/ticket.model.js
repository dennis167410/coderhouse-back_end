import mongoose from 'mongoose';

const collection = "tickets";

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
      //  unique: true,
        require: true
    },
    purchase_datetime:  {
        type: Date,
        default: Date.now
    } , // let now = new Date(); Deberá guardar la fecha y hora exacta en la cual 	se formalizó la compra (básicamente es un created_at)
    amount: {
        type: Number
    }, 
	purchaser: {
           type: String,
    }      //contendrá el correo del usuario asociado al carrito.
});

/*
cartSchema.pre('find', function(){
    this.populate('purchaser')
});*/

const ticketModel = mongoose.model(collection, ticketSchema);
export default ticketModel;