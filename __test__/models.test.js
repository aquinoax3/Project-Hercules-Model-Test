
const mongoose = require("mongoose")
const { config } = require("dotenv")
const { beforeAll, describe, test, expect } = require("@jest/globals")
const UserModel = require("../models/User.js")
const ExerciseModel  = require("../models/Exercise.js")
const WorkoutModel  = require("../models/Workout.js")
const sinon = require("sinon")
const { MongoMemoryServer } = require("mongodb-memory-server")

describe("User tests with real populate", () => {
    let mongoServer;
    
    const userId1 = new mongoose.Types.ObjectId("66a1f9f52ed51393b271b6ec");
    const workoutId = new mongoose.Types.ObjectId("66a1fa3fc7fee0b648b130e6");
    const exerciseId = new mongoose.Types.ObjectId("66a1fa66b4a39263cf3ef380");

    const mockUser = {
        _id: userId1,
        Of_Id: "1",
        Nickname: "Phil",
        Email: "Phil@test.com",
        WorkoutIds: []
    };

    const mockWorkout = {
        _id: workoutId,
        Type: "Upper Body",
        Level: "Beginner",
        "Focus_Area": "Chest",
        ExerciseIds: [exerciseId]
    };

    beforeAll(async () => {
        // server was timing, added set time out to extend the wait to 20 seconds
        jest.setTimeout(20000); // 20 seconds
        //Creates new instance of "MongoMemoryServer" and starts it
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        
        // Insert test data
        await UserModel.create(mockUser);
        await WorkoutModel.create(mockWorkout);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        // Stops the server
        await mongoServer.stop();
    });

    test("Create a new user", async () => {
        const user = await UserModel.create({
            Of_Id: "1",
            Nickname: "Phil",
            Email: "Phil@test.com",
            WorkoutIds: []
        })

        // console.log(JSON.stringify(user, null, 2))
        expect(user.Nickname).toBe(mockUser.Nickname)
        expect(user.Email).toBe(mockUser.Email)
    })

    test("Find user by Id", async () => {
        const user = await UserModel.findById(userId1)

        expect(user.Nickname).toBe(mockUser.Nickname)
        expect(user.Of_Id).toBe(mockUser.Of_Id)
    })

    test("Fine all users", async () => {
        const users = await UserModel.find()

        // console.log(JSON.stringify(users, null, 2))
        expect(users.length).toBe(2)
    })

    test("User info can be updated", async () => {
        const userUpdate = await UserModel.findByIdAndUpdate(userId1, { Nickname: "Phillip" })
        const updatedUser = await UserModel.findById(userId1)
        
        // console.log(JSON.stringify(userUpdate, null, 2))
        // console.log(JSON.stringify(updatedUser, null, 2))         
        expect(userUpdate._id.toString()).toBe(updatedUser._id.toString())
    })

    test("User can add exercises to workout", async () => {
        // Find the user and add a workout ID
        const user = await UserModel.findOne({ _id: userId1 });
        user.WorkoutIds.push(workoutId);
        await user.save();

        // Populate the user's workouts
        const populatedUser = await UserModel.findOne({ _id: userId1 }).populate("WorkoutIds");

        // console.log(JSON.stringify(populatedUser, null, 2))
        // Ensure the populatedUser.WorkoutIds is correctly populated
        expect(populatedUser.WorkoutIds[0]._id.toString()).toEqual(workoutId.toString());
        expect(populatedUser.WorkoutIds[0].Type).toBe(mockWorkout.Type);
        expect(populatedUser.WorkoutIds[0].Level).toBe(mockWorkout.Level);
        expect(populatedUser.WorkoutIds[0].Focus_Area).toBe(mockWorkout.Focus_Area);
        expect(populatedUser.WorkoutIds[0].ExerciseIds).toEqual(mockWorkout.ExerciseIds); 
    });
});


// describe("Exercise Test", () => {
//     let mockCreate
//     let mockFindAll
//     let mockFindByOne
//     let mockUpdateOne
//     let mockFindOneAndDelete
    
//     const mockExercises = [
//         {
//             Name: "Squats",
//             Rep: 10,
//             Set: 3
//         },
//         {
//             Name: "Pull Up",
//             Rep: 8,
//             Set: 3
//         },
//         {
//             Name: "Chest Press",
//             Rep: 10,
//             Set: 3
//         },
//     ]



//     beforeAll(async () =>{
//         mockCreate = sinon.stub(ExerciseModel, "create").resolves({
//                 Name: "Squats",
//                 Rep: 10,
//                 Set: 3
//         })

//         mockFindAll = sinon.stub(ExerciseModel, "find").resolves(mockExercises)

//         mockFindByOne = sinon.stub(ExerciseModel, "findOne").resolves(mockExercises[0])

//         mockUpdateOne = sinon.stub(ExerciseModel, "findOneAndUpdate").resolves({ Rep: 8 })

//         mockFindOneAndDelete = sinon.stub(ExerciseModel, "findOneAndDelete").resolves(mockExercises[0])
//     })


//     afterAll(async () =>{
//         sinon.restore()
//     })

//     test("Create a new exercise (mocked)", async () => {
//         const createdExercise = await ExerciseModel.create({
//             Name: "Squats",
//             Rep: 10,
//             Set: 3
//         })

//         expect(createdExercise).toEqual(mockExercises[0])
//     })

//     test("Find all exercises (mocked)", async () => {
//         const exercises = await ExerciseModel.find()

//         expect(exercises).toEqual(mockExercises)
//     })

//     test("Find exercise (mocked)", async () => {
//         const exercise = await ExerciseModel.findOne({Name: "Squats"})

//         expect(exercise).toBe(mockExercises[0])
//     })

//     test("Exercise can be updated (mocked", async () => {
//         const exercise = await ExerciseModel.findOneAndUpdate({ Name: "Squat" }, { Rep: 8})

//         expect(exercise.Rep).toBe(8)
//     })

//     test("Delete Exercise (mocked)", async () => {
//         const deleteExercise = await ExerciseModel.findOneAndDelete({ Name: "Squat"})

//         expect(deleteExercise).toBe(mockExercises[0])
//     })
    
// })


// describe("Workout Tests", () => {
//     let mockCreate
//     let mockFindAll
//     let mockFindByOne
//     let mockUpdateOne
//     let mockFindOneAndDelete

//     const mockWorkouts = [
//         {
//             Type: "Upper body",
//             Level: "Beginner",
//             Exercise: []
//         },
//         {
//             Type: "Lower body",
//             Level: "Intermediate",
//             Exercise: []
//         },
//         {
//             Type: "Legs",
//             Level: "Advanced",
//             Exercise: []
//         }
//     ]

//     beforeAll(async () =>{
//         mockCreate = sinon.stub(WorkoutModel, "create").resolves({
//                 Type: "Push",
//                 Level: "Beginner",
//                 Exercise: []
//         })

//         mockFindAll = sinon.stub(WorkoutModel, "find").resolves(mockWorkouts)

//         mockFindByOne = sinon.stub(WorkoutModel, "findOne").resolves(mockWorkouts[0])

//         mockUpdateOne = sinon.stub(WorkoutModel, "findOneAndUpdate").resolves({ Rep: 8 })

//         mockFindOneAndDelete = sinon.stub(WorkoutModel, "findOneAndDelete").resolves(mockWorkouts[0])
//     })


//     afterAll(async () =>{
//         sinon.restore()
//     })

//     test("Create a workout", async () => {
//         // const workout = await WorkoutModel.create({
//         //     Type: "Push",
//         //     Level: "Beginner",
//         //     Exercise: []
//         // })

//         // expect(workout).toEqual(mockWorkouts[0])
//     })
// })





