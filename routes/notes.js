const notesRoute = require("express").Router();
const { v4: uuidv4 } = require("uuid");

const {
  readAndAppend,
  readFromFile,
  writeToFile,
} = require("../helpers/fsUtils");

// GET Route for retrieving all the data
notesRoute.get("/", (req, res) =>
  readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting feedback
notesRoute.post("/", (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    readAndAppend(newNote, "./db/db.json");

    const response = {
      status: "success",
      body: newNote,
    };

    res.json(response);
  } else {
    res.json("Error in posting feedback");
  }
});

notesRoute.delete("/:id", (req, res) => {
  readFromFile("./db/db.json")
    .then((data) => {
      const requestedId = req.params.id.toLowerCase();
      let match = false;
      let noteData = JSON.parse(data);

      // This gets rid of the matching note id
      for (let i = 0; i < noteData.length; i++) {
        if (requestedId === noteData[i].id.toLowerCase()) {
          match = true;
          noteData.splice(i, 1);
        }
      }

      if (match) {
        // write to db.json
        writeToFile("./db/db.json", noteData);
        const response = {
          status: "success",
        };
        res.json(response);
      } else {
        res.json("No id found");
      }
    })
    .catch((error) => console.log(error));
});

module.exports = notesRoute;
