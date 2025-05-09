const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const app = express();
const port = 27017; 

app.use(cookieParser('U@FS3CUR1TYK3Y'));
app.use(cors({
    origin: 'http://localhost:3000', // your frontend port
    credentials: true,
  }));
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/mydb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open',() => console.log("Connected to MongoDB"));

app.get('/',(req,res)=>{
    res.send('Hellow from Express');
});

app.listen(port,()=> {
    console.log(`Server running on port ${port}`);
});



//routes

const User = require('./model/user');
// app.post('/user',async (req,res)=>{
//     const user = new User({
//         username:req.body.username,
//         password:req.body.password,
//     });
//     try{
//         const newUser = await user.save();
//         res.status(201).json(newUser);
//     } catch (err){
//         res.status(400).json({message: err.message});
//     }
// });
app.post('/user', async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(400).json({ message: 'Failed to create user', error: err });
    }
  });
app.get('/user',async (req,res) => {
    try{
        const user = await User.find();
        res.json(user);
    }catch (err) {
        res.status(500).json({
            message:err.message
        });
    }
});

// app.get("/user/:name/:password",async(req,res)=>{
//     try{
//         const user = await User.findOne({
//             name:req.params.name,
//             password:req.params.password
//         });
//         if(!user){
//             return res.status(404).json({message:"Item not found"});
//         }else{
//             res.json(user);
//         }
//     }catch(e){
//         return res.status(505).json({message:e.message});
//     }
// });
// Login route (cookie set here)
app.post("/login", async (req, res) => {
    const { name, password } = req.body;
    try {
        const user = await User.findOne({ name, password });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }
        // Set secure signed cookie
        res.cookie("user", user.username, {
            httpOnly: true,
            signed: true,
            sameSite: 'lax',
            secure: false, // change to true if using HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.json({ userID:user._id,name: user.name, department: user.department });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// Check current logged-in user
app.get("/me", (req, res) => {
    const username = req.signedCookies.user;
    if (!username) {
        return res.status(401).json({ message: "Not logged in" });
    }

    res.json({ username });
});

// Logout route (clear cookie)
app.post("/logout", (req, res) => {
    res.clearCookie("user");
    res.json({ message: "Logged out successfully" });
});



const Attendance = require('./model/attendance');
app.get('/attendance/present-today', async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    try {
        const records = await Attendance.find({
            date: { $gte: today, $lt: tomorrow }
          }).populate('userID', 'name department regular rank subdepartment'); // populate name & department only
      
          res.json(records);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching present records' });
    }
  });
app.post('/attendance', async (req, res) => {
    const {         userID,
        status,
        department,
        amAbsenceType,  
        pmAbsenceType,  
        country,
        location,
        dutyOff,
        courseName,
        absenceDuration,
        fullDay,
        date,
        reason } = req.body;


    // Validate required fields
    if (!status || !date || !userID) {
        return res.status(400).json({ message: 'A server error has occured' });
    }

    const attendanceEntry = new Attendance({
        userID,
        status,
        department,
        amAbsenceType,  
        pmAbsenceType,  
        country,
        location,
        dutyOff,
        courseName,
        absenceDuration,
        fullDay,
        date,
        reason
        
    });

    try {
        const savedEntry = await attendanceEntry.save();
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/attendance/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    try {
      const results = await Attendance.find({
        userID: userId,
        $or: [
          { date: {
            $gte: startOfDay,
            $lt: endOfDay
          }}, // Present today
          {
            absenceDuration: { $gte: startOfDay } // Still absent today (e.g. OL til today or future)
          }
        ]
      }).populate('userID', 'name department regular rank subdepartment');
      res.json(results);
    } catch (err) {
      console.error('Error fetching user attendance:', err);
      res.status(500).json({ message: err.message });
    }
  });
  app.put('/attendance/:id', async (req, res) => {
    const attendanceId = req.params.id;
    const {
      userID,
      status,
      department,
      amAbsenceType,
      pmAbsenceType,
      country,
      location,
      dutyOff,
      courseName,
      absenceDuration,
      fullDay,
      date,
      reason
    } = req.body;
  
    // Validate required fields
    if (!status || !date || !userID) {
      return res.status(400).json({ message: 'A server error has occurred' });
    }
  
    try {
      const updatedEntry = await Attendance.findByIdAndUpdate(
        attendanceId,
        {
          userID,
          status,
          department,
          amAbsenceType,
          pmAbsenceType,
          country,
          location,
          dutyOff,
          courseName,
          absenceDuration,
          fullDay,
          date,
          reason
        },
        { new: true } // return the updated document
      );
  
      if (!updatedEntry) {
        return res.status(404).json({ message: 'Attendance record not found' });
      }
  
      res.json(updatedEntry);
    } catch (error) {
      console.error('Error updating attendance:', error.message);
      res.status(500).json({ message: error.message });
    }
  });
  
//SETTING UP 
// // const [const1] = require('./model/[themodel]');

//GET 
// app.get("/[api_route]",async(req,res)=>{
//    try{
//     const [result] = await [const1].find();
//     res.json([result]);
//    }catch(err){
//     res.status(500).json({
//         message:err.message
//     });
//    }
// });


//POST
// app.post("/[api_route]",async(req,res)=>{
//     const [insert_object] = new [const1]({
//         [variable1]:req.body.[link_variable1], \\it will be send in a object {[link_variable1]: data, [link_variable2]: data }
//         [variable2]:req.body.[link_variable2]
//     });
//     try{
//         const [result] = await [insert_object].save();
//         res.status(301).json("item has been added");
//     }catch(err){
//         res.status(501).json({
//             message:err.message
//         });
//     }
// });

//SEARCH BY VARIABLE
// app.get("/[api_route]/:[searched_variable]",async(req,res)=>{
//     try{
//         const [result] = await [const1].find({
//             [variable1]:{ $regex: `${req.params.[searched_variable]}`, $options: "i" }
//         });
//         if([result].length == 0){
//             return res.status(404).json({message:"Item not found"});
//         }else{
//             res.json([result]);
//         }
//     }catch(e){
//         return res.status(505).json({message:e.message});
//     }
// });

//DELETE BY VARIABLE
//  app.delete("/[api_route]/:[searched_variable]",async(req,res)=>{
//     try{
        
//         const [result] = await [const1].deleteOne({_id:req.params.[searched_variable]  });

//         if([result].deletedCount === 1)
//         {
//             res.status(200).json({message: 'Successfully deleted'});
            
//         }
//         else{
//             res.status(404).json({message:'No Document found'});
           
//         }
        
//     }catch(e)
//     {
//         res.status(500).json({message: e});
//     }
//  })

//UPDATE BY VARIABLE
//  app.put("/[api_route]/:[searched_variable]", async (req, res) => {
//     try {
//         const [result] = await [const1].findByIdAndUpdate(
//             req.params.[searched_variable], 
//             { link: req.body.[variable1], videoname: req.body.[variable1] } \\it will be send in a object {[link_variable1]: data, [link_variable2]: data }
//         );

//         if (![result]) {
//             return res.status(404).json({ message: "Video not found" });
//         }

//         res.status(200).json({ message: "Video updated successfully"});
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
