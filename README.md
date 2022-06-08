# Modern To-Do App

<img src="./react_app/public/logo.svg" alt="TODO Logo" width="300"/>

This app aims to use modern web development technologies including React.js, Node.js and MongoDB to develop a simple CRUD application.

# Architecture
The Express.js server acts as the back-end. The user requests for the React.js front-end page from the root of the
express server.
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
- path

# Running the Stack
## The Front-End
From the ```react-app``` directory, 
- run ```npm start``` to begin the development server.
- run ```npm build``` to create an optimised production build that can be accessed by the server.
##  The Back-End
From the ```express_backend``` directory, run ```node server.js```

Note that you will need to build the front-end before being able to access it from the root of the server.

## Running Mongodb
From the app's root directory, run with
```mongod --dbpath=./mongodb_data```

Note that you need to make the directory ```./mongodb_data``` before starting the database.

### Manually Modifying the DB

__Note that this is not needed for running the software.__

We can connect to the DB using ```mongosh``` which will open a shell that automatically connects to the running ```mongod```.

We set up the database manually using the following commands:
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
