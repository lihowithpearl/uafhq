const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status:{
        type:String,
        required: true
    },
    department:{
        type:String
    },
    amAbsenceType:{
        type:String,
        enum: ["",'RSO', 'OL', 'LL', 'attachedOut', 'medicalAppt', 'dutyOff', 'course', 'others'],
    }, 
    pmAbsenceType:{
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
        type:Date
    },
    fullDay:{
        type:String
    },
    date:{
        type:Date,
        required:true
    },
    reason:{
        type:String
    }

    
});
module.exports = mongoose.model('Attendance',attendanceSchema);