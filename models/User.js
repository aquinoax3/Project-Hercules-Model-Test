import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    UserId: {
        type: String
    },
    Nickname: {
        type: String
    },
    Email: {
        type: String
    },
    Workouts: {
        type: Array 
    }
})


const UserModel = mongoose.model("User", UserSchema);

export default UserModel;