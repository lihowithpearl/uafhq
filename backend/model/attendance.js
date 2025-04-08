const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required: true
    },
    department:{
        type:String
    },
    absenceType:{
        type:String,
        enum: ["",'RSO', 'OL', 'LL', 'attachedOut', 'medicalAppt', 'dutyOff', 'course', 'others'],
    },
    country:{
        type:String
    },
    location:{
        type:String
    },
    dutyOff:{
        type:String
    },
    courseName:{
        type:String
    },
    absenceDuration:{
        type:String
    },
    date:{
        type:Date,
        required:true
    }

    
});
module.exports = mongoose.model('Attendance',attendanceSchema);