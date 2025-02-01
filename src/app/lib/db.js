import mongoose  from "mongoose";

const MONGODB_URI = process.env.NEXT_PUBLIC_MONGODB_URI;



const connection = {};
async function connectDb(){
    if(connection.isConnected){
        console.log('Already connected to Database');
        return
    }
    try{
        const dbConnect = await mongoose.connect(MONGODB_URI);
        // const dbConnect = await mongoose.connect('mongodb://localhost:27017/growFood')
        connection.isConnected = dbConnect.connections[0].readyState;
    console.log("Connected to database");
    }catch(e){
        console.log("Error connecting to Database", e);
        process.exit(1);
    }
}

export default connectDb;
