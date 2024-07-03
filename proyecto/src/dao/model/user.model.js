import mongoose from 'mongoose';

const collection = "users";

const rolType = {
    USER: "USER",
    ADMIN: "ADMIN",
    PREMIUM: "PREMIUM",
    PUBLIC: "PUBLIC",
}

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        required: true,
    },
    age: Number,
    password: String,

    carts:{
        type: [
            {  
                cart: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"carts" //Nombre de la collección.
                },
            },
        ],
        default: []
    },
    role: {
        type: String,
        enum: Object.values(rolType),
    },
    last_connection: {
        type: Date,
        default: Date.now
    }

});

userSchema.pre("find", function (){
    this.populate("carts.cart");
})

const userModel = mongoose.model(collection, userSchema);
export default userModel;