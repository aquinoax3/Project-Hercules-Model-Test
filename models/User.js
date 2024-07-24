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
    WorkoutIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout" // Reference the Workout model name
    }]
})



const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel