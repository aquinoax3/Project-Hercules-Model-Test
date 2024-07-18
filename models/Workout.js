import mongoose  from "mongoose";

const WorkoutSchema = new mongoose.Schema({
    WorkoutId: {
        type: ObjectId
    },
    Name: {
        type: String
    },
    Rep: {
        type: Number
    },
    Set: {
        type: Number
    }
})



const WorkoutModel = mongoose.model("Workout", WorkoutSchema);

export default WorkoutModel;