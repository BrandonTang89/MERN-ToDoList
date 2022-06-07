const express = require('express');
const mongoose = require("mongoose");
mongoose.set('debug', true);

// Connect to DB
mongoose.connect('mongodb://localhost:27017/ToDoDB', { useNewUrlParser: true, useUnifiedTopology: true });
const taskSchema = new mongoose.Schema({
    index: Number,
    name: String,
    desc: String,
    tags: [String],
    taskStatus: String,
}, { collection : 'user_tasks' }); 
const Task = mongoose.model('Task', taskSchema);

const app = express();
const port = 8000;

// Initial Testing Tasks
let initTasks = [
    { index: 1, name: 'Learn HTML', desc: "Create at least something", tags: ['Task 1.1', 'Task 1.2', "Brandon", "Hello", "hello"], taskStatus: "Not Started" },
    { index: 2, name: 'Learn CSS', desc: "Create at least a stylesheet", tags: ['Task 2.1', 'Task 2.2'], taskStatus: "In Progress" },
    { index: 3, name: 'Learn JAVASCRIPT', desc: "Create at least an APP", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 4, name: 'Learn C++', desc: "Create at least a programme", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 5, name: 'Learn Python', desc: "Create at least an AI", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 6, name: 'Learn Haskell', desc: "Create at least a paper", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 7, name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
  ];

app.get('/', function (req, res) {
    res.send('Hello World! This is the express backend');
});

app.post('/getdata', async function (req, res) {
    let Tasks = await Task.find({});
    res.send(Tasks);
});

app.post('/createtask', function (req, res) {
    // Get task information from body
    let task = req.body;
});

app.post('/updatetask', function (req, res) {
    // Get task information from body
    let task = req.body;
});

app.post('/deletetask', function (req, res) {
    // Get task information from body
    let task = req.body;
});

app.listen(port), () => {
    console.log(`Example app listening at http://localhost:${port}`);
};