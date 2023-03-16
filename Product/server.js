const express = require('express');
const path = require('path');
const fs = require('fs');

const randomId = require('random-id-util');

//const { getAndRenderNotes, handleNoteSave } = require('./public/assets/js/index.js');

const noteData = require('./db/db.json');
const PORT = 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// * to return the index.html file
app.get('/', (req, res) => {
    console.log('Sent index.html');
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
//  /notes to return the notes.html file
app.get('/notes', (req, res) => {
    console.log('Sent notes.html');
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//  /api/notes to read the db.json file and return all saved notes as JSON
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

//  /api/notes to receive a new note to save, add to the db.json file, return the new note to the client.  Each note should have a unique id.
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`POST request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            title,
            text,
            id: randomId(8),
        };

        /*   const response = {
              status: 'success',
              body: newNote,
          }; */

        fs.readFile('db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedData = JSON.parse(data);

                parsedData.push(newNote);

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