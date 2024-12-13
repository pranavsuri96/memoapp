if (typeof document !== 'undefined') {
    const apiUrl = "https://salmon-dune-0a4bac010.4.azurestaticapps.net/api/saveNote";

    document.getElementById('save-note').addEventListener('click', async () => {
        const noteContent = document.getElementById('note-content').value.trim();

        if (!noteContent) {
            alert('Please write something in the note!');
            return;
        }

        // Generate a new note ID if the current note is deleted or no note exists in the URL
        let noteId;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('note') && localStorage.getItem(urlParams.get('note'))) {
            noteId = urlParams.get('note'); // Reuse existing note ID
        } else {
            noteId = Math.random().toString(36).substr(2, 9); // Generate new note ID
            // Update the URL with the new noteId
            window.history.replaceState({}, document.title, `?note=${noteId}`);
        }

        // Send note to Azure Function
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ noteId, content: noteContent })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Show success message
            } else {
                alert('Failed to save note!');
            }
        } catch (error) {
            console.error('Error saving note:', error);
            alert('An error occurred while saving the note.');
        }

        // Generate shareable link
        const shareLink = `${window.location.origin}?note=${noteId}`;
        document.getElementById('share-link').value = shareLink;

        // Show the share link section
        document.getElementById('note-link').classList.remove('hidden');
    });

    document.getElementById('copy-link').addEventListener('click', () => {
        const shareLinkInput = document.getElementById('share-link');

        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999); // For mobile compatibility

        navigator.clipboard.writeText(shareLinkInput.value)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    });

    // Load note if the page URL contains a note ID
    window.onload = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('note');

        if (noteId) {
            try {
                const response = await fetch(`${apiUrl}?note=${noteId}`);
                const noteContent = await response.json();

                if (noteContent) {
                    document.getElementById('note-content').value = noteContent;
                    const shareLink = `${window.location.origin}?note=${noteId}`;
                    document.getElementById('share-link').value = shareLink;
                    document.getElementById('note-link').classList.remove('hidden');
                } else {
                    alert('Note not found or has been deleted!');
                    // Clear the URL if the note doesn't exist
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (error) {
                console.error('Error fetching note:', error);
                alert('An error occurred while retrieving the note.');
            }
        }
    };
}
