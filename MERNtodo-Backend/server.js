//Express

const express = require("express")
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()


//create an instance of Express
const app = express()

//middleware
app.use(express.json())
app.use(cors())

//sample in memory storage for todo items
// let todos=[]
  

//connecting Mongoose
mongoose.connect('mongodb://localhost:27017/mern-app')
// mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("DB connected!!!")
})
.catch((err)=>{
   console.log(err)
})

//createing a schema
const todoShcema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating a model
const todoModel = mongoose.model('todo',todoShcema)

//Create a new todo item
app.post('/todos',async (req,res)=>{
    const {title,description}=req.body
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo)
    // console.log(todos)

   try{
      const newTodo = new todoModel({title,description})
      await newTodo.save()
      res.status(201).json(newTodo)
   }catch(err){
      console.log(err)
      res.status(500).json({message:err.message})
   }

})
//get all items

app.get('/todos',async (req,res)=>{
    try{
     const todos =  await todoModel.find()
     res.json(todos)
    }catch(err){
      console.log(err)
      res.status(500).json({message:err.message})
    }
} )

//update a todo item
app.put("/todos/:id", async (req,res)=>{
    try{
        const {title,description}=req.body;
   const id = req.params.id;
  const updatedTodo = await todoModel.findByIdAndUpdate(
    id,
    { title , description },
    {new: true}

   )

   if(!updatedTodo){
    return res.status(404).json({message: "Todo not found"})
   }
   res.json(updatedTodo)
    }catch(err){
     console.log(err)
      res.status(500).json({message:err.message})
    }
 
})

//delete a todo item
app.delete('/todos/:id', async (req,res)=>{
    try{
      const id =req.params.id;
    await todoModel.findByIdAndDelete(id)
    res.status(204).end();
    }catch(err){
     console.log(err)
      res.status(500).json({message:err.message})
    }
    
})
//Start a server
const port = process.env.PORT || 8000
app.listen(port,()=>{
     console.log(`Server listening on http://localhost:${port}`);
})

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// /* ================= MIDDLEWARE ================= */
// app.use(express.json());

// app.use(cors({
//   origin: "https://newmernproject-frontend.onrender.com",
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type"]
// }));

// // 👇 VERY IMPORTANT for preflight
// app.options("*", cors());

// /* ================= DATABASE ================= */
// mongoose.connect(process.env.MONGO_URI)
// .then(() => {
//   console.log("DB connected!!!");
// })
// .catch((err) => {
//   console.log("DB connection error:", err);
// });

// /* ================= SCHEMA ================= */
// const todoSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   description: String
// });

// const todoModel = mongoose.model("todo", todoSchema);

// /* ================= ROUTES ================= */

// // Create todo
// app.post("/todos", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const newTodo = new todoModel({ title, description });
//     await newTodo.save();
//     res.status(201).json(newTodo);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get all todos
// app.get("/todos", async (req, res) => {
//   try {
//     const todos = await todoModel.find();
//     res.json(todos);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Update todo
// app.put("/todos/:id", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const updatedTodo = await todoModel.findByIdAndUpdate(
//       req.params.id,
//       { title, description },
//       { new: true }
//     );

//     if (!updatedTodo) {
//       return res.status(404).json({ message: "Todo not found" });
//     }

//     res.json(updatedTodo);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete todo
// app.delete("/todos/:id", async (req, res) => {
//   try {
//     await todoModel.findByIdAndDelete(req.params.id);
//     res.status(204).end();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// /* ================= SERVER ================= */
// const port = process.env.PORT || 8000;
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
