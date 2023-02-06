// Import Required Modules
const express = require('express');
const path = require("path");
const fs = require('fs');

// Set Up Database
let notesDB = require('./db/db.json');
// Set Port

const PORT = process.env.PORT || 3000;
// Create Express Server
const app = express();

// Use Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// For everything is running in the frontend, use this folder
app.use(express.static(__dirname + '/public')); 
// Define HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Define API Routes
app.get(`/api/notes`, (req, res) => {
    res.json(notesDB);
});

app.post('/api/notes', (req, res) => {
    // Add new note to database
    let nNote = req.body;
    // Add it to the `notesDB.json` file
    notesDB.push(nNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notesDB), (err) => {
        if (err) {
            throw err;
        }
    });
    // Return updated note list
    res.json(notesDB);
});
// Add DELETE Route
app.delete(`/api/notes/:id`, (req, res) => {
    // Delete note by id
    let id = req.params.id;
    // Remove the note with the given `id`
    for (var i = 0; i < notesDB.length; i++) {
        if (id === notesDB[i].id) {
            notesDB = notesDB.filter((note) => {
                return note.id != id;
            });
            // Rewrite the notes to the `notesDB.json` file
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(notesDB), (err) => {
                if (err) {
                    throw err;
                }
            });
            return res.json(notesDB);
        }
    }
    return res.json(false);
});

// Start Server Listener
app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});