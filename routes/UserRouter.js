const express = require("express")
const UserModel = require("../models/User.js")

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id
        const user = await UserModel.findOne({
            Of_Id: id
        })
        res.send(user);
    } catch (error) {
        res.status(404).send(error)
    }

})

router.post("/users", async (req, res) => {
    const user = new UserModel(req.body);

    try {
        console.log("Received data", req.body)
        await user.save({ new: true });
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})


module.exports = router