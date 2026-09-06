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

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
].filter(Boolean)

app.use(cors({
    origin: (origin, callback) => {
        // same-origin requests (no Origin header) and whitelisted origins are allowed
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error(`CORS blocked for origin ${origin}`))
    },
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

// simple health check route so frontend can verify server is running
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "ping" });
});

// On serverless the process is reused between invocations, so connect once
// and make every request wait for the connection to be ready.
app.use(async (req, res, next) => {
    try {
        await connectDb()
        next()
    } catch (error) {
        res.status(500).json({ message: `Database connection failed: ${error.message}` })
    }
})

app.use("/api/auth" , authRouter)
app.use("/api/user", userRouter)
app.use("/api/interview" , interviewRouter)
app.use("/api/payment" , paymentRouter)

const PORT = process.env.PORT || 5000

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
