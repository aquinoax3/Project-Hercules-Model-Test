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

    const mockUsers = [
        {
            "Of_Id": "1",
            "Nickname": "Phil",
            "Email": "Phil@test.com",
            "Workouts": []
        },

        {
            "Of_Id": "2",
            "Nickname": "Bob",
            "Email": "Bob@test.com",
            "Workouts": []
        }
    ]

    beforeAll(async () =>{
        mockCreate = sinon.stub(UserModel, "create").resolves({
            "Of_Id": "1",
            "Nickname": "Phil",
            "Email": "Phil@test.com",
            "Workouts": []
        })

        mockFindAll = sinon.stub(UserModel, "find").resolves(mockUsers)

        mockFindById = sinon.stub(UserModel, "findById").resolves(mockUsers[0])

        mockUpdateOne = sinon.stub(UserModel, "findOneAndUpdate").resolves({Nickname: "Phillip"})
    })


    afterAll(async () =>{
        sinon.restore()
    })
    
    test("Create a new user (mocked)", async () =>{
        const newUser = {
            "Of_Id": "1",
            "Nickname": "Phil",
            "Email": "Phil@test.com",
            "Workouts": []
        }
        const createdUser = await UserModel.create(newUser)

        expect(createdUser).toEqual(newUser)
    })

    test("Find all users (mocked)", async () => {

        const users = await UserModel.find()

        expect(users).toEqual(mockUsers)
    })

    test("Find user by Id (mocked)", async () =>{
        const userId = "1"
        const user = await UserModel.findById(userId)

        expect(user).toEqual(mockUsers[0])
    })

    test("User info can be updated (mocked)", async () =>{
        const userId ={ Of_id: "1" }
        const updatedData =  { Nickname: "Phillip" }
        const user = await UserModel.findOneAndUpdate(userId, updatedData)

        expect(user.Nickname).toBe("Phillip")
    })
})


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
            Type: "Push",
            Level: "Beginner",
            Exercise: []
        },
        {
            Type: "Pull",
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
        const workout = await WorkoutModel.create({
            Type: "Push",
            Level: "Beginner",
            Exercise: []
        })

        expect(workout).toEqual(mockWorkouts[0])
    })
})





