if (typeof document !== 'undefined') {
    const apiManagementBaseUrl = 'https://memonote.azure-api.net/api';

    document.getElementById('save-note').addEventListener('click', () => {
        const noteContent = document.getElementById('note-content').value;

        if (!noteContent.trim()) {
            alert('Please write something in the note!');
            return;
        }

        // Generate a unique ID for the note
        const noteId = Math.random().toString(36).substr(2, 9);

        // Send note data to the API Management backend
        fetch(`${apiManagementBaseUrl}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'f1ea90bbb3454b2696486b9b5fd1a0e0' // Replace 'Your-API-Key' with your actual API key
            },
            body: JSON.stringify({ id: noteId, content: noteContent })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save note');
            }
            return response.json();
        })
        .then(data => {
            // Generate shareable link
            const shareLink = `${window.location.origin}?note=${noteId}`;
            document.getElementById('share-link').value = shareLink;

            // Show the share link
            document.getElementById('note-link').classList.remove('hidden');
        })
        .catch(err => {
            console.error('Error saving note:', err);
            alert('Failed to save note!');
        });
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
    window.onload = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('note');

        if (noteId) {
            // Fetch note from API Management backend
            fetch(`${apiManagementBaseUrl}/notes/${noteId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': 'Your-API-Key' // Replace 'Your-API-Key' with your actual API key
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    document.getElementById('note-content').value = data.content;
                } else {
                    alert('Note not found!');
                }
            })
            .catch(err => {
                console.error('Error loading note:', err);
                alert('Failed to load note!');
            });
        }
    };
}
