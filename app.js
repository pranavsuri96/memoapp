const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Azure Blob Storage setup
const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerName = 'memonoteblob'; // Name of your Blob container
const containerClient = blobServiceClient.getContainerClient(containerName);

// Ensure the container exists
async function ensureContainerExists() {
    try {
        const exists = await containerClient.exists();
        if (!exists) {
            await containerClient.create();
            console.log(`Container "${containerName}" created.`);
        } else {
            console.log(`Container "${containerName}" already exists.`);
        }
    } catch (error) {
        console.error('Error ensuring container existence:', error);
        process.exit(1); // Exit if the container setup fails
    }
}
ensureContainerExists();

// API to save a note
app.post('/api/notes', async (req, res) => {
    const { id, content } = req.body;

    if (!id || !content) {
        return res.status(400).json({ error: 'Invalid input: Note ID and content are required.' });
    }

    try {
        const blockBlobClient = containerClient.getBlockBlobClient(`${id}.txt`);
        await blockBlobClient.upload(content, Buffer.byteLength(content));
        console.log(`Note with ID "${id}" saved successfully.`);
        res.status(200).json({ message: 'Note saved successfully', id });
    } catch (error) {
        console.error('Error saving note:', error);
        res.status(500).json({ error: 'Failed to save note' });
    }
});

// API to retrieve a note
app.get('/api/notes/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const blockBlobClient = containerClient.getBlockBlobClient(`${id}.txt`);
        const downloadResponse = await blockBlobClient.download();
        const content = await streamToString(downloadResponse.readableStreamBody);

        console.log(`Note with ID "${id}" retrieved successfully.`);
        res.status(200).json({ id, content });
    } catch (error) {
        console.error(`Error retrieving note with ID "${id}":`, error);
        res.status(404).json({ error: 'Note not found' });
    }
});

// Helper function to convert stream to string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => chunks.push(data.toString()));
        readableStream.on('end', () => resolve(chunks.join('')));
        readableStream.on('error', reject);
    });
}

// Health Check Endpoint
app.get('/', (req, res) => {
    res.status(200).send('Server is running and healthy.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

