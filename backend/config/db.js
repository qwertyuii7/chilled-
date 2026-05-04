const mongoose =require("mongoose");


require( 'dotenv' ).config()





const connectiondb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URL)

    }catch(e){
        return res.status(404).json({
            message:"connection failed"
        })
    }    

}

module.exports = connectionDB;
    
    
    





