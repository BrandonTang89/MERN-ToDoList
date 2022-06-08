/**Express Backend Server
 * This sever connects to the mongodb database via mongoose and responds to requests via express.
 */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const jsonParser = bodyParser.json();
// mongoose.set('debug', true);

// High Level Variables
// const db_url = "mongodb://localhost:27017/ToDoDB";
const db_url = process.env.DB_URL;
const port = process.env.PORT || 5000;

// Connect to DB
mongoose.connect(db_url, { useNewUrlParser: true, useUnifiedTopology: true });
const taskSchema = new mongoose.Schema(
  {
    name: String,
    desc: String,
    tags: [String],
    taskStatus: String,
  },
  { collection: "user_tasks" }
);
const Task = mongoose.model("Task", taskSchema);

// Set up express
const app = express();
app.use(cors());

// Initial Testing Tasks
/*
let initTasks = [
    { name: 'Learn HTML', desc: "Create at least something", tags: ['Task 1.1', 'Task 1.2', "Brandon", "Hello", "hello"], taskStatus: "Not Started" },
    { name: 'Learn CSS', desc: "Create at least a stylesheet", tags: ['Task 2.1', 'Task 2.2'], taskStatus: "In Progress" },
    { name: 'Learn JAVASCRIPT', desc: "Create at least an APP", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn C++', desc: "Create at least a programme", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn Python', desc: "Create at least an AI", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn Haskell', desc: "Create at least a paper", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
  ];*/

// Routes
if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  app.use(express.static("react-app/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/react-app/build/index.html"));
  });
}

app.post("/api/getdata", async function (req, res) {
  let Tasks = await Task.find({});
  res.send(Tasks);
});

app.post("/api/createtask", jsonParser, async function (req, res) {
  // Get task information from body
  let task = req.body;
  await Task.create(task);
  res.send("Task Created");
});

app.post("/api/updatetask", jsonParser, async function (req, res) {
  // Get task information from body
  // console.log("Updating task", req.body);
  if (req.body.taskStatus === "") {
    res.send("Task Status cannot be empty");
    return;
  }
  if (req.body.name === "") {
    res.send("Task Name cannot be empty");
    return;
  }
  await Task.updateOne({ _id: req.body._id }, { $set: req.body });
  res.send("Task Updated");
});

app.post("/api/deletetask", jsonParser, async function (req, res) {
  // Get task information from body
  await Task.deleteOne({ _id: req.body._id });
  res.send("Task Deleted");
});

// Start server
app.listen(port),
  () => {
    console.log(`Example app listening at http://localhost:${port}`);
  };
