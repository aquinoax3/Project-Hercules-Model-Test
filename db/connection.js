import mongoose from "mongoose";
import { config } from "dotenv";

config();

const uri = process.env.MONGODB_URI

async function connect() {
    try {
        await mongoose.connect(uri)
        console.log("Connected to database")
    } catch (error) {
        console.log(error)
    }
}


    const db = connect();

export default {
    db
}