import mongoose from "mongoose";

let connectionPromise = null

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection
    }

    if (!process.env.MONGODB_URL) {
        throw new Error("MONGODB_URL environment variable is not set")
    }

    if (!connectionPromise) {
        connectionPromise = mongoose
            .connect(process.env.MONGODB_URL, { serverSelectionTimeoutMS: 10000 })
            .then((conn) => {
                console.log("DataBase Connected")
                return conn
            })
            .catch((error) => {
                connectionPromise = null
                console.error(`DataBase Error ${error}`)
                throw error
            })
    }

    return connectionPromise
}

export default connectDb
