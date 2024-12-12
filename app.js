if (typeof document !== 'undefined') {
    document.getElementById('save-note').addEventListener('click', async () => {
        const noteContent = document.getElementById('note-content').value;

        if (!noteContent.trim()) {
            alert('Please write something in the note!');
            return;
        }

        // Generate a unique ID for the note
        const noteId = Math.random().toString(36).substr(2, 9);

        // Connect to Azure Blob Storage
        const azureStorageAccountName = 'memonote';
        const azureStorageAccountKey = 'OGIeeIzwsR7dkJJSVhroKhhK5gEDI9kf5xp65uLexQF1Vq34Q07DcWkwylPLzrL+SbZ9SGaTVuS++ASte8EvGg==';
        const blobServiceClient = new Azure.StorageBlob.BlobServiceClient(
            `https://${azureStorageAccountName}.blob.core.windows.net`,
            new Azure.StorageBlob.StorageSharedKeyCredential(azureStorageAccountName, azureStorageAccountKey)
        );

        const containerName = 'notes-container';
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Upload note content as a blob
        const blobName = `${noteId}.txt`;
        const blobClient = containerClient.getBlobClient(blobName);
        await blobClient.upload(noteContent, noteContent.length);

        // Generate a shareable link
        const shareLink = `${window.location.origin}?note=${blobName}`;
        document.getElementById('share-link').value = shareLink;

        // Show the share link
        document.getElementById('note-link').classList.remove('hidden');
    });

    document.getElementById('copy-link').addEventListener('click', () => {
        const shareLinkInput = document.getElementById('share-link');

        // Select the text in the input field
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // For mobile compatibility

        // Copy the text to the clipboard
        navigator.clipboard.writeText(shareLinkInput.value)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    });

    // Check if the page has a note ID in the URL
    window.onload = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('note');

        if (noteId) {
            // Connect to Azure Blob Storage
            const azureStorageAccountName = 'memonote';
            const azureStorageAccountKey = 'OGIeeIzwsR7dkJJSVhroKhhK5gEDI9kf5xp65uLexQF1Vq34Q07DcWkwylPLzrL+SbZ9SGaTVuS++ASte8EvGg==';
            const blobServiceClient = StorageBlob.BlobServiceClient(`https://${azureStorageAccountName}.blob.core.windows.net`, new Azure.StorageBlob.StorageSharedKeyCredential(azureStorageAccountName, azureStorageAccountKey));

            const containerName = 'notes-container';
            const containerClient = blobServiceClient.getContainerClient(containerName);

            const blobClient = containerClient.getBlobClient(noteId);
            const downloadBlockBlobResponse = await blobClient.download(0);
            const noteContent = await new Response(downloadBlockBlobResponse.readableStreamBody).text();

            if (noteContent) {
                document.getElementById('note-content').value = noteContent;
            } else {
                alert('Note not found!');
            }
        }
    };
}
