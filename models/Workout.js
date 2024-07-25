const mongoose = require("mongoose")

const WorkoutSchema = new mongoose.Schema({
    Type: {
        type: String
    },
    Level: {
        type: String
    },
    "Focus_Area":{
        type: String
    },
    ExerciseIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exercise" // Reference the Exercise model name
    }]
})



const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

module.exports = WorkoutModel