import express from "express";
import UserModel from "../models/User.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const users = await UserModel.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send({ error })
    }
})

router.post("/users", async (req, res) => {
    const user = new UserModel(req.body);

    try {
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})


export default router