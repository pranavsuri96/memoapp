if (typeof document !== 'undefined') {
    document.getElementById('save-note').addEventListener('click', () => {
        const noteContent = document.getElementById('note-content').value.trim();

        // Check if the note is empty
        if (!noteContent) {
            const urlParams = new URLSearchParams(window.location.search);
            const noteId = urlParams.get('note');

            if (noteId) {
                // Delete the note from localStorage
                localStorage.removeItem(noteId);
                alert('Note deleted successfully!');
            } else {
                alert('No note to delete!');
            }

            // Hide the share link section and reset the form
            document.getElementById('note-link').classList.add('hidden');
            document.getElementById('share-link').value = '';
            return;
        }

        // Generate or reuse the note ID
        let noteId;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('note')) {
            noteId = urlParams.get('note'); // Use existing ID
        } else {
            noteId = btoa(noteContent).substr(0, 9); // Generate a unique ID
        }

        // Save the note to localStorage
        localStorage.setItem(noteId, noteContent);

        // Generate a shareable link
        const shareLink = `${window.location.origin}?note=${noteId}`;
        document.getElementById('share-link').value = shareLink;

        // Show the share link section
        document.getElementById('note-link').classList.remove('hidden');

        alert('Note saved successfully!');
    });

    document.getElementById('copy-link').addEventListener('click', () => {
        const shareLinkInput = document.getElementById('share-link');

        // Select and copy the shareable link
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

    // Check if the page has a note ID in the URL
    window.onload = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const noteId = urlParams.get('note');

        if (noteId) {
            const noteContent = localStorage.getItem(noteId);

            if (noteContent) {
                document.getElementById('note-content').value = noteContent;
                const shareLink = `${window.location.origin}?note=${noteId}`;
                document.getElementById('share-link').value = shareLink;
                document.getElementById('note-link').classList.remove('hidden');
            } else {
                alert('Note not found or has been deleted!');
            }
        }
    };
}

