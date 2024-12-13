const { app } = require('@azure/functions');

// Temporary in-memory storage (use a database in production)
const notesStorage = {};

app.http('saveNote', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            // Parse the incoming request body
            const { noteId, content } = await request.json();

            // Validate the input
            if (!noteId || !content) {
                return {
                    status: 400,
                    body: { error: 'Both noteId and content are required.' },
                };
            }

            // Save the note in memory
            notesStorage[noteId] = content;

            // Log for debugging
            context.log(`Saved note: ${noteId} -> ${content}`);

            // Return success response
            return {
                status: 200,
                body: { message: 'Note saved successfully!', noteId },
            };
        } catch (error) {
            context.log.error('Error processing request:', error);

            return {
                status: 500,
                body: { error: 'An internal error occurred. Please try again.' },
            };
        }
    },
});
