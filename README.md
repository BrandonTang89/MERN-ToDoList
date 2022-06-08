# Modern To-Do App

<img src="./react-app/public/logo.svg" alt="TODO Logo" width="300"/>

This app aims to use modern web development technologies including React.js, Node.js and MongoDB to develop a simple CRUD application.

# Requirements
The project runs on the MERN stack, thus we require the following programmes
- node.js
- mongodb (community edition)

The specific node modules required are:

Within ```react-app```
- react
- react-helmet
- lodash
- semantic-ui-react
- semantic-ui-css

Within ```express_backend```
- express
- mongoose
- mongodb
- cors
- bodyParser

# Running the Stack
## Running the Front-End
From the ```react-app``` directory, run ```npm build```
## Running the Server
From the ```express_backend``` directory, run ```node server.js```

## Running Mongodb
From the app's root directory, run with
```mongod --dbpath=./mongodb_data```

### Initial Set-Up of DB
We can connect to the DB using ```mongosh``` which will open a shell that automatically connects to the running ```mongod```.

We set up using the following commands:
```bash
use ToDoDB # Creates the new DB
db.createCollection("user_tasks") # creates a collection in the DB
db.user_tasks.insertMany([
    { name: 'Learn HTML', desc: "Create at least something", tags: ['Task 1.1', 'Task 1.2', "Brandon", "Hello", "hello"], taskStatus: "Not Started" },
    { name: 'Learn CSS', desc: "Create at least a stylesheet", tags: ['Task 2.1', 'Task 2.2'], taskStatus: "In Progress" },
    { name: 'Learn JAVASCRIPT', desc: "Create at least an APP", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn C++', desc: "Create at least a programme", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn Python', desc: "Create at least an AI", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn Haskell', desc: "Create at least a paper", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
  ]) # insert the example data
```
### Play Around With the Data
```bash
db.user_tasks.updateOne(
  {name: "Learn C#"},
  { $set: { name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Not Started" }}
) # Updates task with index 7

db.user_tasks.insertOne({ name: "Learn MongoDB", desc: "Create at least a database", tags: ["database", "nosql"], taskStatus: "In Progress"}) # Insert a new document

db.user_tasks.deleteOne({index: 7}) # Delete document
```

### Other Useful ```mongosh``` Commands
- ```db.getCollectionNames()``` lists the collections in a database
- ```db.COLLECTIONNAME.drop()``` drops the specific collection
- ```db.user_tasks.find()``` lists all objects in the collection
- ```db.user_tasks.deleteMany({})``` deletes all documents in the collection
- ```show dbs``` lists all the databases
