const mongoose = require("mongoose");
const { config } = require("dotenv")

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

module.exports = {
    db
}