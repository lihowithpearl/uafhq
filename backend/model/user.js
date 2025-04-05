const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:Number,
        required:true,
    },
    department:{
        type:String
    }
    
});
module.exports = mongoose.model('User',userSchema);