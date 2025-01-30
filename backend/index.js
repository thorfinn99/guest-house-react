import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js"
import roomRoute from "./routes/room.route.js"
import bookingsRoute from './routes/bookings.route.js'

dotenv.config({});

const app = express();

app.get("/home", (req,res)=> {
    return res.status(200).json({
        messege:"its coming from backend",
        succes:true
    })
} ) 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions = [
{ origin: 'https://guest-house-frontend.vercel.app/', credentials:true},
{ origin: '', methods: ["POST", "GET", "PUT"] ,credentials:true},
]
app.use(cors(corsOptions))


 
const PORT = process.env.PORT || 8000;

app.use("/api/v1/user", userRoute)
app.use("/api/v1/room", roomRoute)
app.use("/api/v1/bookings", bookingsRoute)

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server running at port ${PORT}`);
    
} )
