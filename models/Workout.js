const mongoose = require("mongoose")

const WorkoutSchema = new mongoose.Schema({
    Type: {
        type: String
    },
    Level: {
        type: Number
    },
    Exercises: {
        type: Array
    }
})



const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

module.exports = WorkoutModel