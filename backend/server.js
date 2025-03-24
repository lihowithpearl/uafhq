const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();
const port = 27017; 

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://127.0.0.1:27017/mydb',{
    useNewURLParser:true,
    useUnifiedTopology: true,
});

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
app.post('/user',async (req,res)=>{
    const user = new User({
        username:req.body.username,
        password:req.body.password,
    });
    try{
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err){
        res.status(400).json({message: err.message});
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
