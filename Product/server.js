const express = require('express');
const path = require('path');
const fs = require('fs');
// npm package selected to create random id numbers
const randomId = require('random-id-util');

const noteData = require('./db/db.json');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Returns the index.html file after the server starts
app.get('/', (req, res) => {
    console.log('Sent index.html');
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
// Returns the notes.html file when the "Get Started" button is clicked
app.get('/notes', (req, res) => {
    console.log('Sent notes.html');
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// Reads the db.json file and return all saved notes as JSON
app.get('/api/notes', (req, res) => {
    console.info(`GET request received for notes`);
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            res.status(201).json(parsedData);
        }
    });
});

// Receives a new note to save, add it to the db.json file, returns the new note to the user.
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`POST request received to add a note`);

    const { title, text } = req.body;
    // If data exists in both title and text, creates the new note
    if (title && text) {
        const newNote = {
            title,
            text,
            id: randomId(8), // Adds the random id
        };
        // Reads the saved notes from the db file
        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedData = JSON.parse(data);
                // Adds new note to the parsed data
                parsedData.push(newNote);
                // Writes all the notes to the db file
                fs.writeFile('db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
                    err ? console.error(err) : console.info(`\nData written to db/db.json`)
                );
            }
        });

        console.log('Success');
        res.status(201).json(newNote);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);