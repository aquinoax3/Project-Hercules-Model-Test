
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
        // jest.setTimeout(20000); // 20 seconds
        //Creates new instance of "MongoMemoryServer" and starts it
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
        
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

        expect(user).toBeInstanceOf(UserModel)
        expect(user.Of_Id).toBe(mockUser.Of_Id)
        expect(user.Nickname).toBe(mockUser.Nickname)
        expect(user.Email).toBe(mockUser.Email)
    })

    test("Find user by Id", async () => {
        const user = await UserModel.findById(userId1)


        expect(user._id.toString()).toBe(mockUser._id.toString())
        expect(user.Nickname).toBe(mockUser.Nickname)
        expect(user.Of_Id).toBe(mockUser.Of_Id)
    })

    test("Find all users", async () => {
        const users = await UserModel.find()

        expect(users.length).toBe(2)
    })

    test("User info can be updated", async () => {
        const user = await UserModel.findByIdAndUpdate(userId1, { Nickname: "Phillip" })
        const updatedUser = await UserModel.findById(userId1)

        expect(updatedUser._id.toString()).toBe(user._id.toString())
        expect(updatedUser.Of_Id ).toBe(user.Of_Id)
        expect(user.Nickname).not.toBe("Phillip")
        expect(updatedUser.Nickname).toBe("Phillip")
    })

    test("User can add exercises to workout", async () => {
        // Find the user and add a workout ID
        const user = await UserModel.findOne({ _id: userId1 });
        user.WorkoutIds.push(workoutId);
        await user.save();

        // Populate the user's workouts
        const populatedUser = await UserModel.findOne({ _id: userId1 }).populate("WorkoutIds");

        // Ensure the populatedUser.WorkoutIds is correctly populated
        expect(populatedUser.WorkoutIds[0]._id.toString()).toEqual(workoutId.toString());
        expect(populatedUser.WorkoutIds[0].Type).toBe(mockWorkout.Type);
        expect(populatedUser.WorkoutIds[0].Level).toBe(mockWorkout.Level);
        expect(populatedUser.WorkoutIds[0].Focus_Area).toBe(mockWorkout.Focus_Area);
        expect(populatedUser.WorkoutIds[0].ExerciseIds).toEqual(mockWorkout.ExerciseIds); 
    });

    test("can get all users workouts", async () => {
        const workout1 = await WorkoutModel.create({
                Type: "Body Building",
                Level: "Beginner",
                Focus_Area: "Upper Body",
                ExerciseIds: []
            })

        const workout2 = await WorkoutModel.create({
                Type: "Strength Training",
                Level: "Intermediate",
                Focus_Area: "Lower Body",
                ExerciseIds: []
            })

        const workout3 = await WorkoutModel.create({
                Type: "Body Building",
                Level: "Advance",
                Focus_Area: "Upper Body",
                ExerciseIds: []
        })

        const user = await UserModel.findById(userId1)
        user.WorkoutIds.push(workout1)
        user.WorkoutIds.push(workout2)
        user.WorkoutIds.push(workout3)

        const populatedUser = await user.populate("WorkoutIds")

        console.log(populatedUser)

        expect(populatedUser.WorkoutIds[0]).toBeInstanceOf(WorkoutModel)
        expect(populatedUser.WorkoutIds.length).toEqual(4)
        expect(populatedUser.WorkoutIds[1].Type).toBe("Body Building")
        expect(populatedUser.WorkoutIds[2].Type).toBe("Strength Training")
        expect(populatedUser.WorkoutIds[3].Type).toBe("Body Building")
    })
});


describe("Workout Test with real populate", () => {
    let mongoServer;
    
    const userId1 = new mongoose.Types.ObjectId("66a1f9f52ed51393b271b6ec");
    const workoutId = new mongoose.Types.ObjectId('66a3260509dc6dfe77a823ae');
    const exerciseId = new mongoose.Types.ObjectId('66a3393bcd9204f6a0712cfd');

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
        Focus_Area: "Chest",
        ExerciseIds: [exerciseId]
    };

    const mockExercise = {
        Name: 'Push ups',
        Rep: 8,
        Set: 3,
    }

    beforeAll(async () => {
        // server was timing, added set time out to extend the wait to 20 seconds
        jest.setTimeout(20000); // 20 seconds
        //Creates new instance of "MongoMemoryServer" and starts it
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
        
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

    test("Create a new workout", async () => {
        const workout = await WorkoutModel.create({
            Type: "Upper Body",
            Level: "Beginner",
            Focus_Area: "Chest",
            ExerciseIds: [exerciseId]
        })

        expect(workout).toBeInstanceOf(WorkoutModel)
        expect(workout.Type).toBe(mockWorkout.Type)
        expect(workout.Level).toBe(mockWorkout.Level)
        expect(workout.Focus_Area).toBe(mockWorkout.Focus_Area)
    })

    test("Find workout by Id", async () => {
        const workout = await WorkoutModel.findById(workoutId)

        expect(workout.Type).toBe(mockWorkout.Type)
    })

    test("Find all workouts", async () => {
        const workouts = await WorkoutModel.find()

        expect(workouts.length).toEqual(2) 
    })

    test("Exercise can be added to workout", async () => {
        const workout = await WorkoutModel.findById(workoutId)
        .populate("ExerciseIds")

        const exercise = await ExerciseModel.create({
            Name: "Push ups",
            Rep: 8,
            Set: 3
        })

        workout.ExerciseIds.push(exercise)
        await workout.save()

        expect(exercise).toBeInstanceOf(ExerciseModel)
        expect(workout.ExerciseIds[0].Name).toBe(mockExercise.Name)
        expect(workout.ExerciseIds[0].Rep).toEqual(mockExercise.Rep)
        expect(workout.ExerciseIds[0].Set).toEqual(mockExercise.Set)

    })
})



describe("Exercise Test", () => {
    let mongoServer;
    

    const exerciseId = new mongoose.Types.ObjectId('66a3bc5d6197b7b7b08013f3');

    const mockExercise = {
        _id: exerciseId,
        Name:"Push Up",
        Rep: 10,
        Set: 8
    }

    beforeAll(async () => {
        // server was timing, added set time out to extend the wait to 20 seconds
        jest.setTimeout(20000); // 20 seconds
        //Creates new instance of "MongoMemoryServer" and starts it
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();

        await mongoose.connect(uri);
        
        // Insert test data
        const exercise = await ExerciseModel.create(mockExercise); 
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        // Stops the server
        await mongoServer.stop();
    });

    test("Create an exercise", async () => {
        const exercise = await ExerciseModel.create({
            Name: "Push Up",
            Rep: 10,
            Set: 8
        })

        expect(exercise).toBeInstanceOf(ExerciseModel)
        expect(exercise.Name).toBe(mockExercise.Name)
        expect(exercise.Rep).toEqual(mockExercise.Rep)
        expect(exercise.Set).toEqual(mockExercise.Set)

    })

    test("Find exercise by Id", async () => {
        const exercise = await ExerciseModel.findById('66a3bc5d6197b7b7b08013f3')

        expect(exercise.Name).toBe(mockExercise.Name)
        expect(exercise.Rep).toEqual(mockExercise.Rep)
        expect(exercise.Set).toEqual(mockExercise.Set)
    })

    test("Exercise info can be updated", async () => {
        const exercise = await ExerciseModel.findByIdAndUpdate(exerciseId, {Name: "Pull Up"})
        const updateExercise = await ExerciseModel.findById(exerciseId)

        expect(exercise._id.toString()).toBe(updateExercise._id.toString())
        expect(updateExercise.Name).toBe("Pull Up")
        expect(exercise.Rep).toEqual(updateExercise.Rep)
        expect(exercise.Set).toEqual(updateExercise.Set)
    })

    test("Exercise can be deleted", async () => {
        const exercise = await ExerciseModel.findByIdAndDelete(exerciseId)
        const deletedExercise = await ExerciseModel.findById(exerciseId)

        expect(deletedExercise).toBeNull() 
    })

})




