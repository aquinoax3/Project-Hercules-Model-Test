import mongoose  from "mongoose";

const ExerciseSchema = new mongoose.Schema({
    ExerciseId: {
        type: ObjectId
    },
    Type: {
        type: String
    },
    Level: {
        type: String
    },
    Workouts: {
        type: Array
    }
})



const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

export default ExerciseModel;