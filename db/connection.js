require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
    .connection(MONGODB_URI)
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(err);
    })

    const db = mongoose.connection;

module.exports = {
    db
}