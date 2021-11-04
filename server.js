/////////////////////////
// Dependencies
/////////////////////////
require("dotenv").config()
const { PORT = 3000, DATABASE_URL } = process.env
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const morgan = require("morgan")
const cors = require("cors")


/////////////////////////
// Database connection
/////////////////////////
mongoose.connect(DATABASE_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
})

mongoose.connection
.on("open", ()=>{console.log("Connected to mongo")})
.on("close", ()=>{console.log("Disconnected from mongo")})
.on("error", (error)=>console.log(error))


/////////////////////////
// Models
/////////////////////////
const CheeseSchema = new mongoose.Schema({
    name: String,
    countryOfOrigin: String,
    image: String
})

const Cheese = mongoose.model("Cheese", CheeseSchema)

/////////////////////////
// Middleware
/////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())


/////////////////////////
// Routes
/////////////////////////
app.get("/", (req, res) => {
    res.send("hello world")
})

// Index route
app.get("/cheese", async (req, res)=>{
    try{
        res.json(await Cheese.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

// Create route
app.post("/cheese", async (req, res) => {
    try{
        res.json(await Cheese.create(req.body))
    } catch(error){
        res.status(400).json(error)
    }
})

// Update route
app.put("/cheese/:id", async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// Delete route
app.delete("/cheese/:id", async (req, res) =>{
    try{
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch(error){
        res.status(400).json(error)
    }
})


/////////////////////////
// Listener
/////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))

