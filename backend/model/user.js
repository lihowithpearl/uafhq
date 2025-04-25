const { type } = require('@testing-library/user-event/dist/type');
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
    regular:{
        type:Boolean,
        required:true,
    },
    rank:{
        type:String,
        required:true,
    },
    batch:{
        type:String,
        required: true,
    },
    phonenumber:{
        type:Number,
        required:true,
    },
    department:{
        type:String
    },
    subdepartment:{
        type:String
    }
    
});
module.exports = mongoose.model('User',userSchema);