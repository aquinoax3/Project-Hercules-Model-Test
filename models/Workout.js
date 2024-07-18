import mongoose  from "mongoose";

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

export default WorkoutModel;