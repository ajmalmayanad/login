const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/SignedupUsers").then(()=>{console.log("mongodb connected successfuly")}).catch(()=>{
    console.log("Failed to connect")
})

const LogInSchema=new mongoose.Schema({username:{type:String,required:true},email:{type:String,required:true},password:{type:String,required:true}})

const collection=new mongoose.model("NewCredentials",LogInSchema)

module.exports=collection