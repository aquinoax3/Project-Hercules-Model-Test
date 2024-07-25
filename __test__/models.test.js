const { beforeAll, describe, test, expect } = require("@jest/globals")
const UserModel = require("../models/User.js")
const mongoose = require("mongoose")
const { config } = require("dotenv")
const sinon = require("sinon")
const ExerciseModel  = require("../models/Exercise.js")
const WorkoutModel  = require("../models/Workout.js")


describe("User tests", () => {
    let mockCreate, mockFindAll, mockFindById, mockUpdateOne, mockFindOne;

    const workoutId = new mongoose.Types.ObjectId("66a1e41f2bd4779d9904b13d");
    
    const userId1 = new mongoose.Types.ObjectId("66a09718935504a7c4b4ef18");
    const userId2 = new mongoose.Types.ObjectId("66a09718935504a7c4b4ef19");
    const userId3 = new mongoose.Types.ObjectId("66a09718935504a7c4b4ef20");



    const mockWorkouts = [
        { _id: workoutId, Type: "Upper Body", Level: "Beginner", FocusArea: "Chest", ExerciseIds: [1] }
    ];

    const mockUsers = [
        {
            _id: userId1,
            Of_Id: "1",
            Nickname: "Phil",
            Email: "Phil@test.com",
            WorkoutIds: []
        },
        {
            _id: userId2,
            Of_Id: "2",
            Nickname: "Bob",
            Email: "Bob@test.com",
            WorkoutIds: [workoutId]
        },
        {
            _id: userId3,
            Of_Id: "3",
            Nickname: "Lily",
            Email: "Lily@test.com",
            WorkoutIds: []
        }
    ];

    beforeAll(async () => {
        mockCreate = sinon.stub(UserModel, "create").resolves(new UserModel(mockUsers[2]));
        mockFindAll = sinon.stub(UserModel, "find").resolves(mockUsers.map(user => new UserModel(user)));
        mockFindById = sinon.stub(UserModel, "findById").resolves(new UserModel(mockUsers[0]));
        mockUpdateOne = sinon.stub(UserModel, "findByIdAndUpdate").resolves(new UserModel({ _id: userId1, Nickname: "Phillip" }));        mockFindOne = sinon.stub(UserModel, "findOne").resolves(new UserModel(mockUsers[0]));

        sinon.stub(mongoose.Model.prototype, "populate").callsFake(function () {
            this.WorkoutIds = mockWorkouts;
            return Promise.resolve(this);
        });

    });

    afterAll(async () => {
        sinon.restore();
    });

    test("Create a new user (mocked)", async () =>{
        const newUser = {
            "_id": userId3,
            "Of_Id": "3",
            "Nickname": "Lily",
            "Email": "Lily@test.com",
            "WorkoutIds": []
        }

        const user = await UserModel.create(newUser)

        expect(user.toObject()).toEqual(mockUsers[2])
    })

    test("Find user by Id (mocked)", async () => {
        const user = await UserModel.findById(userId1)

        expect(user.toObject()).toEqual(mockUsers[0])
    })

    test("Find all users (mocked)", async () => {
        const users = await UserModel.find()

        expect(users.map(user => user.toObject())).toEqual(mockUsers)
    })

    test("User info can be updated (mocked)", async () => {
        const user = await UserModel.findByIdAndUpdate(userId1, { Name: "Phillip" })

        console.log(user) 
        expect(user.Nickname).toBe("Phillip")
    })

    test("User can add exercises to workout", async () => {
        const user = await UserModel.findOne({ _id: userId1 });
        user.WorkoutIds.push(workoutId);
        const populatedUser = await user.populate("WorkoutIds");

        // Ensure the populatedUser.WorkoutIds is correctly populated
        expect(populatedUser.WorkoutIds[0]._id.toString()).toEqual(workoutId.toString());
    });
});


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





