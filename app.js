if (typeof document !== 'undefined') {
    const apiBaseUrl = 'https://salmon-dune-0a4bac010.4.azurestaticapps.net/api'; // Replace with your actual function app URL

    document.getElementById('save-note').addEventListener('click', async () => {
        const noteContent = document.getElementById('note-content').value.trim();

        if (!noteContent) {
            alert('Please write something in the note!');
            return;
        }

        const noteId = Math.random().toString(36).substr(2, 9);
        try {
            const response = await fetch(`${apiBaseUrl}/saveNote?noteId=${noteId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer DyXvPpMETApgHTYQqhevYymB06xsfM_7lwifPMdbIxwEAzFup-sk7Q==` // Replace <YOUR_FUNCTION_KEY> with the actual key
                },
                body: JSON.stringify({ content: noteContent })
            });

            if (response.ok) {
                const data = await response.json();
                const shareLink = `${window.location.origin}?note=${noteId}`;
                document.getElementById('share-link').value = shareLink;
                document.getElementById('note-link').classList.remove('hidden');
                alert('Note saved successfully!');
            } else {
                alert('Error saving note.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while saving the note.');
        }
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

    window.onload = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('note');

        if (noteId) {
            try {
                const response = await fetch(`${apiBaseUrl}/saveNote?noteId=${noteId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer <YOUR_FUNCTION_KEY>` // Replace <YOUR_FUNCTION_KEY> with the actual key
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    document.getElementById('note-content').value = data.content;
                    const shareLink = `${window.location.origin}?note=${noteId}`;
                    document.getElementById('share-link').value = shareLink;
                    document.getElementById('note-link').classList.remove('hidden');
                } else {
                    throw new Error('Failed to retrieve note');
                }
            } catch (error) {
                alert('An error occurred while retrieving the note.');
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }
    };
}
