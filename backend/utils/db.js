import mongoose from "mongoose";

const connectDB = async ()=> {
    try {
        await mongoose.connect(process.env.MONGO_URI1)
        console.log('mongo connected successfully');
    } catch (error) {
        console.log(error);
    }
}
export default connectDB; 