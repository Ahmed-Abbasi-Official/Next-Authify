import mongoose from "mongoose";

export async function connect(){
    try {
        console.log(process.env.MONGO_URI)
        mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection;

        connection.on('connected',()=>{
            console.log("Mongo DB Connected")
        })

        connection.on('error',(err)=>{
            console.log('Mongo DB Error' + err)
            process.exit();
        })
    } catch (error) {
        console.log('Something went wrong in connecting to DB');
        console.log(error)
        
    }
}