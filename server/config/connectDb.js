import mongoose from "mongoose";

const connectDb = async () => {
    try {
        // mongoose 7+ includes sane defaults; explicit options are no longer needed
        // simply pass the connection string and any app‑specific settings if necessary
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("DataBase Connected")
    } catch (error) {
        console.error(`DataBase Error ${error}`)
        // rethrow so callers know the connection failed
        throw error
    }
}

export default connectDb