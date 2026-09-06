import express from "express"
import dotenv from "dotenv"
import connectDb from "./config/connectDb.js"
import cookieParser from "cookie-parser"
dotenv.config()
import cors from "cors"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import interviewRouter from "./routes/interview.route.js"
import paymentRouter from "./routes/payment.route.js"

const app = express()
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

// simple health check route so frontend can verify server is running
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "ping" });
});

const PORT = process.env.PORT || 5000
// start the server only after we've established a database connection
// this prevents Mongoose from buffering queries when the first request arrives
const startServer = async () => {
    try {
        await connectDb()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        })
    } catch (err) {
        console.error("Failed to start server because DB connection failed:", err)
        process.exit(1)
    }
}

if (!process.env.VERCEL) {
    startServer();
}

export default app;
