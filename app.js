const express = require('express')
const db = require("./db/connection.js")
const UserRouter = require("./routes/UserRouter.js")

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded({extended: true }));
app.use("/api", UserRouter);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

db;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
