import mongoose from "mongoose";


export const connectDB = async() => {

 try {
    const conn = await mongoose.connect(process.env.mongo_URI)
    console.log(`mongoDb connected ${conn.connection.host}`);
    
 } catch (err) {
    console.log(err);
    process.exit(1);
 }

}
