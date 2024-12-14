const express = require('express');
const app = express();
app.use(express.json());

let notes = {};

// Save note
app.post('/api/notes', (req, res) => {
    const { id, content } = req.body;
    notes[id] = content;
    res.status(200).json({ success: true });
});

// Get note by ID
app.get('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    if (notes[noteId]) {
        res.json({ content: notes[noteId] });
    } else {
        res.status(404).json({ error: 'Note not found' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
