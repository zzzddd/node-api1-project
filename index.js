// implement your API here

const express = require("express");
const users = require("./data/db");
// const cors = require("cors");


// const express = require("express"); // CommonJS modules, and it is equivalent to the line above

// const db = require("./data/db.js");

const server = express(); // creates a server

// middleware
server.use(express.json()); // teaches express how to read JSON
// needed for the POST and PUT to work

// request/route handlers

// handles GET requests to / on localhost:8000
server.get("/", (req, res) => {
  res.send("Hello Node 23!");
});
/*  
When the client makes a POST request to /api/users:

If the request body is missing the name or bio property:

cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
If the information about the user is valid:

save the new user the the database.
return HTTP status code 201 (Created).
return the newly created user document.
If there's an error while saving the user:

cancel the request.
respond with HTTP status code 500 (Server Error).
return the following JSON object: { error: "There was an error while saving the user to the database" }.
*/

server.post("/api/users", (req, res) => {
  const userData = req.body;

  if (!userData.name || !userData.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    users
      .insert(userData)
      .then(user => res.status(201).json(user))
      .catch(err =>
        res.status(400).json({
          error: "There was an error while saving the user to the database."
        })
      );
  }
});
/*
When the client makes a GET request to /api/users:

If there's an error in retrieving the users from the database:
cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The users information could not be retrieved." }.
*/ 

server.get("/api/users", (req, res) => {
  users
    .find()
    .then(users => res.send(users))
    .catch(err =>
      res
        .status(500)
        .json({ error: "The users information could not be retrieved." })
    );
});
/*
When the client makes a GET request to /api/users/:id:

If the user with the specified id is not found:

return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The user with the specified ID does not exist." }.
If there's an error in retrieving the user from the database:

cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The user information could not be retrieved." }.


*/

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  users
    .findById(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.json(user);
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "The user information could not be retrieved." })
    );
});
/**
 * 
 * When the client makes a DELETE request to /api/users/:id:

If the user with the specified id is not found:

return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The user with the specified ID does not exist." }.
If there's an error in removing the user from the database:

cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The user could not be removed" }.
 * 
 * 
 * 
 * 
 */

server.delete("/api/users/:id", (req, res) => {
  const id = req.params.id;

  users
    .remove(id)
    .then(user => {
      if (!user) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else {
        res.json(user);
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The user could not be removed." })
    );
});
/**
 When the client makes a PUT request to /api/users/:id:

If the user with the specified id is not found:

return HTTP status code 404 (Not Found).
return the following JSON object: { message: "The user with the specified ID does not exist." }.
If the request body is missing the name or bio property:

cancel the request.
respond with HTTP status code 400 (Bad Request).
return the following JSON response: { errorMessage: "Please provide name and bio for the user." }.
If there's an error when updating the user:

cancel the request.
respond with HTTP status code 500.
return the following JSON object: { error: "The user information could not be modified." }.
If the user is found and the new information is valid:

update the user document in the database using the new information sent in the request body.
return HTTP status code 200 (OK).
return the newly updated user document.
 */

server.put("/api/users/:id", (req, res) => {
  const id = req.params.id;
  const changes = req.body;
console.log('put..', changes)
  if (!changes.name || !changes.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    users
      .update(id, changes)
      .then(user => {
        if (!user) {
          res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
        } else {
          res.status(200).json(user);
        }
      })
      .catch(err =>
        res
          .status(500)
          .json({ error: "The user information could not be modified" })
      );
  }
});



// listen for requests in a particular port on localhost
const port = 8000; // localhost:8000
server.listen(port, () => console.log('\n=== API on port 8000 ===\n'));
