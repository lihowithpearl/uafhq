const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:Int32Array,
        required:true,
    },
    department:{
        type:String
    }
    
});
module.exports = mongoose.model('User',userSchema);