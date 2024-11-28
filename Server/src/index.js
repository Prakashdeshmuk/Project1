import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path:'../.env'
})


connectDB()
.then(()=>
{

    app.on("error",(error)=>
    {
        console.log("Error in Express App Listening",error)
        throw error
    })

    const PORT = process.env.PORT || 4000;
    
    app.listen(PORT,(req,res)=>
    {
        console.log(`App is Listening on Port ${PORT}`)
    })
})
.catch((error)=>{
    console.log("MongoDB Connection Error :",error)
})

