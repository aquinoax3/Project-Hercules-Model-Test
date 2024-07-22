const { beforeAll, describe, test, expect } = require("@jest/globals")
const { UserModel } = require("../models/User.js")
const mongoose = require("mongoose")
const { config } = require("dotenv")
const sinon = require("sinon")



describe("User tests", () => {
    let mockCreate
    let mockFindAll

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

        expect(mockCreate.calledOnceWith(newUser)).toBe(true);
        expect(createdUser).toEqual(newUser)
    })

    test("Find all users", async () => {

        const users = await UserModel.find()

        expect(mockFindAll.calledOnce).toBe(true)
        expect(users).toEqual(mockUsers)
    })
})

