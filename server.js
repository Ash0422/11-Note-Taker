// Requires
const express = require('express');
const { urlencoded } = require('body-parser');
const path = require("path");
const fs = require('fs');

// Database
let db = require('./db/db.json');

// Port
const PORT = process.env.PORT || 3000;

// Create server / Activate Express
const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// For everything is running in the frontend, use this folder
app.use(express.static(__dirname + '/public')); 


// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});


// API Routes
app.get(`/api/notes`, (req, res) => {
    // Read the `db.json` file and return all saved notes as JSON
    res.json(db);
});

app.post('/api/notes', (req, res) => {
    
    // Receive a new note to save on the request body
    let newNote = req.body;

    // Add it to the `db.json` file
    db.push(newNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(db), (err) => {
        if (err) {
            throw err;
        }
    });

    // Return the new note to the client
    res.json(db);
});

app.delete(`/api/notes/:id`, (req, res) => {

    // Receive the id as a query parameter
    let id = req.params.id;

    // Remove the note with the given `id`
    for (var i = 0; i < db.length; i++) {
        if (id === db[i].id) {
            db = db.filter((note) => {
                return note.id != id;
            });

            // Rewrite the notes to the `db.json` file
            fs.writeFile(path.join(__dirname, './db/db.json'), JSON.stringify(db), (err) => {
                if (err) {
                    throw err;
                }
            });
            return res.json(db);
        }
    }
    return res.json(false);
});


// Listener
app.listen(PORT, () => {
    console.log(`Listening at ${PORT}`);
});