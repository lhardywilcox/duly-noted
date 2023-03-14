const express = require('express');
const path = require('path');
const PORT = 3001;
const app = express();

//app.use(express.json());


//  /notes to return the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// * to return the index.html file
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//  /api/notes to read the db.json file and return all saved notes as JSON
//app.get

//  /api/notes to receive a new note to save, add to the db.json file, return the new note to the client.  Each note should have a unique id.
//app.post


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);