// Check if the environment is supported (browser-based)
if (typeof document !== 'undefined') {
    // Replace the localStorage logic with Azure Table Storage integration
    document.getElementById('save-note').addEventListener('click', async () => {
        const noteContent = document.getElementById('note-content').value;

        if (!noteContent.trim()) {
            alert('Please write something in the note!');
            return;
        }

        // Generate a unique ID for the note
        const noteId = Math.random().toString(36).substr(2, 9);

        try {
            // Set up the connection to Azure Table Storage
            const azure = require('@azure/data-tables');
            const tableService = new azure.TableServiceClient(
                process.env.AZURE_TABLE_STORAGE_CONNECTION_STRING
            );

            // Define the table and the note entity
            const tableName = "NotesTable"; // Your table name
            const entity = {
                partitionKey: "notes",
                rowKey: noteId,
                content: noteContent
            };

            // Insert the entity into the Azure Table
            await tableService.createEntity(tableName, entity);

            // Generate a shareable link
            const shareLink = `${window.location.origin}?note=${noteId}`;
            document.getElementById('share-link').value = shareLink;

            // Show the share link
            document.getElementById('note-link').classList.remove('hidden');
            alert('Note saved successfully!');
        } catch (error) {
            console.error('Error saving note:', error);
            alert('Failed to save note!');
        }
    });

    document.getElementById('copy-link').addEventListener('click', async () => {
        const shareLinkInput = document.getElementById('share-link');

        // Select the text in the input field
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // For mobile compatibility

        // Copy the text to the clipboard
        try {
            await navigator.clipboard.writeText(shareLinkInput.value);
            alert('Link copied to clipboard!');
        } catch (err) {
            console.error('Could not copy text: ', err);
        }
    });

    // Check if the page has a note ID in the URL
    window.onload = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('note');

        if (noteId) {
            try {
                const azure = require('@azure/data-tables');
                const tableService = new azure.TableServiceClient(
                    process.env.AZURE_TABLE_STORAGE_CONNECTION_STRING
                );

                const tableName = "NotesTable"; // Your table name
                const entity = await tableService.getEntity(tableName, "notes", noteId);

                if (entity) {
                    document.getElementById('note-content').value = entity.content;
                } else {
                    alert('Note not found!');
                }
            } catch (error) {
                console.error('Error loading note:', error);
                alert('Failed to load note!');
            }
        }
    };
}
