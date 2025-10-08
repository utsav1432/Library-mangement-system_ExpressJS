const express = require('express');

const app = express();

const port = 8081;

app.use(express.json());

// Home Route - GET Method
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Home Page :-)",
    })
})

// app.use( (req, res) => {
//     res.status(500).json({
//         message: `Not Built Yet :-(`
//     })
// });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})