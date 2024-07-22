const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    Of_Id:{
        type: String,
        required: true
    },
    Nickname: {
        type: String,
        required: true
    },
    Email:{
        type: String,
        required: true
    },
    Workouts: []
})



const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel