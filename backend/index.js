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

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'https://guest-house-react-aug.vercel.app',
            'https://guest-house-react-qed6l8508-mohammad-anas-projects-290bb13b.vercel.app'
        ];

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


 
const PORT = process.env.PORT || 8000;

app.use("/api/v1/user", userRoute)
app.use("/api/v1/room", roomRoute)
app.use("/api/v1/bookings", bookingsRoute)

app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server running at port ${PORT}`);
    
} )
