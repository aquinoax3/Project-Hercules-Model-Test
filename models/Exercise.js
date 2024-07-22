import mongoose  from "mongoose";

const ExerciseSchema = new mongoose.Schema({
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



const ExerciseModel = mongoose.model("Exercise", ExerciseSchema);

export default ExerciseModel;