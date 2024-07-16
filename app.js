import express from 'express';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Routes
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
