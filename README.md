# Modern To-Do App

<img src="./react-app/public/logo.svg" alt="TODO Logo" width="300"/>

This app aims to use modern web development technologies including React.js, Node.js and MongoDB to develop a simple CRUD application.

## Running the Server
From the ```express_backend``` directory, run ```node app.js```

## Running Mongodb
From the App's root directory, run with
```mongod --dbpath=./mongodb_data```

### Initial Set-Up of DB
We can connect to the DB using ```mongosh``` which will open a shell that automatically connects to the running ```mongod```.

We set up using the following commands:
```bash
use ToDoDB # Creates the new DB
db.createCollection("user_tasks") # creates a collection in the DB
db.user_tasks.insertMany(
  [
    { index: 1, name: 'Learn HTML', desc: "Create at least something", tags: ['Task 1.1', 'Task 1.2', "Brandon", "Hello", "hello"], taskStatus: "Not Started" },
    { index: 2, name: 'Learn CSS', desc: "Create at least a stylesheet", tags: ['Task 2.1', 'Task 2.2'], taskStatus: "In Progress" },
    { index: 3, name: 'Learn JAVASCRIPT', desc: "Create at least an APP", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 4, name: 'Learn C++', desc: "Create at least a programme", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 5, name: 'Learn Python', desc: "Create at least an AI", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 6, name: 'Learn Haskell', desc: "Create at least a paper", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
    { index: 7, name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Completed" },
  ]
) # Inserts the example data

db.user_tasks.insertOne({curidx: 8}) # Insert the next index counter
```
### Play Around With the Data
```bash
db.user_tasks.updateOne(
  {index: 7},
  { $set: { index: 7, name: 'Learn C#', desc: "Create at least an game", tags: ['Task 3.1', 'Task 3.2'], taskStatus: "Not Started" }}
); # Updates task with index 7

db.user_tasks.insertOne({ index: 8, name: "Learn MongoDB", desc: "Create at least a database", tags: ["database", "nosql"], taskStatus: "In Progress"}); # Insert a new document

db.user_tasks.deleteOne({index: 7}); # Delete document
```

### Other Useful ```mongosh``` Commands
- ```db.getCollectionNames()``` lists the collections in a database
- ```db.COLLECTIONNAME.drop()``` drops the specific collection
- ```db.user_tasks.find()``` lists all objects in the collection
- ```db.user_tasks.deleteMany({})``` deletes all documents in the collection
- ```show dbs``` lists all the databases
