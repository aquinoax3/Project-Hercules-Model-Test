const mongoose = require("mongoose");

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

module.exports =  ExerciseModel;