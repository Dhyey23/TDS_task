const mongoose=require('mongoose')
const connectDb=async()=>{
    try {
        const conn=await mongoose.connect('mongodb+srv://Dhyey_Patel:uHbmbXO5lHwL4BEb@cluster0.rxeam47.mongodb.net/dhyey')
        console.log('MongoDb connected'+ conn.connection.host)
  
    }
    catch(error){
        console.log(error)
        process.exit(1)
    }}

module.exports=connectDb