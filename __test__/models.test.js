const { beforeAll, describe, test, expect } = require("@jest/globals")
const UserModel = require("../models/User.js")
const mongoose = require("mongoose")
const { config } = require("dotenv")
const sinon = require("sinon")
const ExerciseModel  = require("../models/Exercise.js")
const WorkoutModel  = require("../models/Workout.js")


describe("User tests", () => {
    let mockCreate
    let mockFindAll
    let mockFindById
    let mockUpdateOne
    let mockFindOne

    const mockWorkouts = [
        { _id: new mongoose.Types.ObjectId(), Type: "Upper Body", Level: "Beginner", FocusArea: "Chest", ExerciseIds: [1] }
    ];

    const mockUsers = [
        {
            "Of_Id": "1",
            "Nickname": "Phil",
            "Email": "Phil@test.com",
            "WorkoutIds": []
        },
        {
            "Of_Id": "2",
            "Nickname": "Bob",
            "Email": "Bob@test.com",
            "WorkoutIds": [
                {
                    "Type": "Upper Body", 
                    "Level": "Beginner", 
                    "FocusArea": "Chest", 
                }
            ],
        },
        {
            "Of_Id": "3",
            "Nickname": "Lily",
            "Email": "Lily@test.com",
            "WorkoutIds": [],
            "_id": "66a09718935504a7c4b4ef18"

        }
    ]

    const mockExercise = [
        {
            id: 1,
            Name: "Squats",
            Rep: 10,
            Set: 3
        },
    ]

    beforeAll(async () => {
        mockCreate = sinon.stub(UserModel, "create").resolves(new UserModel(mockUsers[2]))
        mockFindAll = sinon.stub(UserModel, "find").resolves(mockUsers.map(user => new UserModel(user)))
        mockFindById = sinon.stub(UserModel, "findById").resolves(new UserModel(mockUsers[0]))
        mockUpdateOne = sinon.stub(UserModel, "findOneAndUpdate").resolves(new UserModel({ Nickname: "Phillip" }))
        mockFindOne = sinon.stub(UserModel, "findOne").resolves(new UserModel(mockUsers[1]))

        sinon.stub(mongoose.Model.prototype, "populate").callsFake(function() {
            this.WorkoutIds = mockWorkouts;
            return Promise.resolve(this);
        })
    })

    afterAll(async () => {
        sinon.restore()
    })

    test("Create a new user (mocked)", async () => {
        const newUser = {
            "Of_Id": "3",
            "Nickname": "Lily",
            "Email": "Lily@test.com",
            "WorkoutIds": []
        }
        const createdUser = await UserModel.create(newUser)

        const createdUserObj = createdUser.toObject()
        const expectedUserObj = new UserModel(newUser).toObject()

        delete createdUserObj._id
        delete expectedUserObj._id

        expect(createdUserObj).toEqual(expectedUserObj)
    })

    // test("Find all users (mocked)", async () => {
    //     const users = await UserModel.find()

    //     expect(users.map(user => user.toObject())).toEqual(mockUsers)
    // })

    // test("Find user by Id (mocked)", async () => {
    //     const userId = "1"
    //     const user = await UserModel.findById(userId)

    //     expect(user.toObject()).toEqual(new UserModel(mockUsers[0]).toObject())
    // })

    // test("User info can be updated (mocked)", async () => {
    //     const userId = { Of_id: "1" }
    //     const updatedData = { Nickname: "Phillip" }
    //     const user = await UserModel.findOneAndUpdate(userId, updatedData)

    //     expect(user.Nickname).toBe("Phillip")
    // })

    // test("User can add exercises to workout", async () => {
    //     const userId = { Of_id: 1 }
    //     const mockExercise = { id: 1, Name: "Push-ups", Reps: 10, Sets: 3 }
    //     const mockWorkout = { Type: "Upper Body", Level: "Beginner", FocusArea: "Chest", ExerciseIds: [mockExercise.id] }

    //     const user = await UserModel.findOne(userId)
    //     const populatedUser = await user.populate("WorkoutIds") // Populate workouts

    //     expect(populatedUser.WorkoutIds).toEqual(mockUsers[1].WorkoutIds)
    // })

    // test("User can add exercises to workout", async () => {
    //     const userId = { Of_id: 1 };
    //     const mockExercise = { id: 1, Name: "Push-ups", Reps: 10, Sets: 3 };
    //     const mockWorkout = { Type: "Upper Body", Level: "Beginner", FocusArea: "Chest", ExerciseIds: [mockExercise.id] };

    //     const user = await UserModel.findOne(userId);
    //     const populatedUser = await user.populate("WorkoutIds");
    //     expect(populatedUser.WorkoutIds).toEqual(mockUsers[1].WorkoutIds);
    // });

    test("User can add exercises to workout", async () => {
        const userId = { Of_id: 1 };
        const mockExercise = { id: 1, Name: "Push-ups", Reps: 10, Sets: 3 };
        const mockWorkouts = { _id: new mongoose.Types.ObjectId(), Type: "Upper Body", Level: "Beginner", FocusArea: "Chest", ExerciseIds: [1] }

        const user = await UserModel.findOne(userId);
        const populatedUser = await user.populate("WorkoutIds");
        
        console.log(populatedUser)
        console.log(mockWorkouts)
        expect(populatedUser.WorkoutIds).toEqual(mockWorkouts);
    });
})

// describe("User tests", () => {
//     let mockCreate
//     let mockFindAll
//     let mockFindById
//     let mockUpdateOne
//     let mockFindOnePopulate

//     const mockUsers = [
//         {
//             "Of_Id": "1",
//             "Nickname": "Phil",
//             "Email": "Phil@test.com",
//             "WorkoutIds": []
//         },

//         {
//             "Of_Id": "2",
//             "Nickname": "Bob",
//             "Email": "Bob@test.com",
//             "WorkoutIds": [
//                 {
//                     Type: "Upper Body", 
//                     Level: "Beginner", 
//                     FocusArea: "Chest", 
//                     // ExerciseIds: [mockExercise.id] 
//                 }

//             ],
//         },
//         {
//             "Of_Id": "3",
//             "Nickname": "Lily",
//             "Email": "Lily@test.com",
//             "WorkoutIds": []
//         }
//     ]

//     const mockExercise = [
//         {
//             id: 1,
//             Name: "Squats",
//             Rep: 10,
//             Set: 3
//         },
//     ]

//     beforeAll(async () =>{
//         mockCreate = sinon.stub(UserModel, "create").resolves(mockUsers[2])

//         mockFindAll = sinon.stub(UserModel, "find").resolves(mockUsers)

//         mockFindById = sinon.stub(UserModel, "findById").resolves(mockUsers[0])

//         mockUpdateOne = sinon.stub(UserModel, "findOneAndUpdate").resolves({Nickname: "Phillip"})

//         mockFindOnePopulate = sinon.stub(UserModel, "findOne").resolves(mockUsers[1])
//     })
    
//     afterAll(async () =>{
//         sinon.restore()
//     })
    
//     test("Create a new user (mocked)", async () =>{
//         const newUser = {
//             "Of_Id": "3",
//             "Nickname": "Lily",
//             "Email": "Lily@test.com",
//             "WorkoutIds": []
//         }
//         const createdUser = await UserModel.create(newUser)

//         expect(createdUser).toEqual(newUser)
//     })

//     test("Find all users (mocked)", async () => {

//         const users = await UserModel.find()

//         expect(users).toEqual(mockUsers)
//     })

//     test("Find user by Id (mocked)", async () =>{
//         const userId = "1"
//         const user = await UserModel.findById(userId)

//         expect(user).toEqual(mockUsers[0])
//     })

//     test("User info can be updated (mocked)", async () =>{
//         const userId ={ Of_id: "1" }
//         const updatedData =  { Nickname: "Phillip" }
//         const user = await UserModel.findOneAndUpdate(userId, updatedData)

//         expect(user.Nickname).toBe("Phillip")
//     })

//     test("User can add exercises to workout", async () => {
//         const userId = {Of_id: 1};
//         const mockExercise = { id: 1, Name: "Push-ups", Reps: 10, Sets: 3 };
//         const mockWorkout = { Type: "Upper Body", Level: "Beginner", FocusArea: "Chest", ExerciseIds: [mockExercise.id] };

//         // // 2. Find user by ID
//         const user = await UserModel.findOne(userId)
//         const populatedUser = await user.populate("WorkoutIds") // Populate workouts

//         // // 3. Associate workout with user (implementation might vary depending on your model)
//         // user.WorkoutIds.push(mockWorkout._id);
//         // await user.save(); // Persist changes (might need adjustment based on your model)
    
//         // // 4. Optional: Re-fetch user to verify association
//         // const updatedUser = await UserModel.findById(userId).populate('WorkoutIds');
    
//         // // 5. Assertion: Ensure the exercise is present in the workouts array of the updated user
//         // expect(updatedUser.WorkoutIds.some(workout => workout._id.equals(mockWorkout._id))).toBe(true);
        
//     })

//     // test("Retrieve user workouts", async () => {
//     //     const userId = "1"
//     //     const user = await UserModel.findById(userId)

//     //     console.log(user.Workouts)
//     //     expect(user.Workouts.length).toBeGreaterThanOrEqual(0)
//     // })
// })


describe("Exercise Test", () => {
    let mockCreate
    let mockFindAll
    let mockFindByOne
    let mockUpdateOne
    let mockFindOneAndDelete
    
    const mockExercises = [
        {
            Name: "Squats",
            Rep: 10,
            Set: 3
        },
        {
            Name: "Pull Up",
            Rep: 8,
            Set: 3
        },
        {
            Name: "Chest Press",
            Rep: 10,
            Set: 3
        },
    ]



    beforeAll(async () =>{
        mockCreate = sinon.stub(ExerciseModel, "create").resolves({
                Name: "Squats",
                Rep: 10,
                Set: 3
        })

        mockFindAll = sinon.stub(ExerciseModel, "find").resolves(mockExercises)

        mockFindByOne = sinon.stub(ExerciseModel, "findOne").resolves(mockExercises[0])

        mockUpdateOne = sinon.stub(ExerciseModel, "findOneAndUpdate").resolves({ Rep: 8 })

        mockFindOneAndDelete = sinon.stub(ExerciseModel, "findOneAndDelete").resolves(mockExercises[0])
    })


    afterAll(async () =>{
        sinon.restore()
    })

    test("Create a new exercise (mocked)", async () => {
        const createdExercise = await ExerciseModel.create({
            Name: "Squats",
            Rep: 10,
            Set: 3
        })

        expect(createdExercise).toEqual(mockExercises[0])
    })

    test("Find all exercises (mocked)", async () => {
        const exercises = await ExerciseModel.find()

        expect(exercises).toEqual(mockExercises)
    })

    test("Find exercise (mocked)", async () => {
        const exercise = await ExerciseModel.findOne({Name: "Squats"})

        expect(exercise).toBe(mockExercises[0])
    })

    test("Exercise can be updated (mocked", async () => {
        const exercise = await ExerciseModel.findOneAndUpdate({ Name: "Squat" }, { Rep: 8})

        expect(exercise.Rep).toBe(8)
    })

    test("Delete Exercise (mocked)", async () => {
        const deleteExercise = await ExerciseModel.findOneAndDelete({ Name: "Squat"})

        expect(deleteExercise).toBe(mockExercises[0])
    })
    
})


describe("Workout Tests", () => {
    let mockCreate
    let mockFindAll
    let mockFindByOne
    let mockUpdateOne
    let mockFindOneAndDelete

    const mockWorkouts = [
        {
            Type: "Upper body",
            Level: "Beginner",
            Exercise: []
        },
        {
            Type: "Lower body",
            Level: "Intermediate",
            Exercise: []
        },
        {
            Type: "Legs",
            Level: "Advanced",
            Exercise: []
        }
    ]

    beforeAll(async () =>{
        mockCreate = sinon.stub(WorkoutModel, "create").resolves({
                Type: "Push",
                Level: "Beginner",
                Exercise: []
        })

        mockFindAll = sinon.stub(WorkoutModel, "find").resolves(mockWorkouts)

        mockFindByOne = sinon.stub(WorkoutModel, "findOne").resolves(mockWorkouts[0])

        mockUpdateOne = sinon.stub(WorkoutModel, "findOneAndUpdate").resolves({ Rep: 8 })

        mockFindOneAndDelete = sinon.stub(WorkoutModel, "findOneAndDelete").resolves(mockWorkouts[0])
    })


    afterAll(async () =>{
        sinon.restore()
    })

    test("Create a workout", async () => {
        // const workout = await WorkoutModel.create({
        //     Type: "Push",
        //     Level: "Beginner",
        //     Exercise: []
        // })

        // expect(workout).toEqual(mockWorkouts[0])
    })
})





