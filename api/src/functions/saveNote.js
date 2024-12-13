const { app } = require('@azure/functions');

app.http('saveNote', {
    methods: ['POST', 'GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        if (request.method === 'POST') {
            const { content } = await request.json();
            const noteId = request.query.get('noteId');
            // Save the note in your storage solution (e.g., Azure Blob Storage, Azure Cosmos DB)
            await saveNoteToStorage(noteId, content);
            return { body: `Note saved with ID: ${noteId}` };
        } else if (request.method === 'GET') {
            const noteId = request.query.get('noteId');
            const noteContent = await getNoteFromStorage(noteId); // Retrieve note from storage
            if (noteContent) {
                return { body: { content: noteContent } };
            } else {
                return { status: 404, body: 'Note not found' };
            }
        } else {
            return { status: 405, body: 'Method not allowed' };
        }
    }
});

