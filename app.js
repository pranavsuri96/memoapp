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

            // Hide the share link and clear inputs
            document.getElementById('note-link').classList.add('hidden');
            document.getElementById('share-link').value = '';
            document.getElementById('note-content').value = '';
            return;
        }

        // Generate or reuse a note ID
        let noteId;
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('note')) {
            noteId = urlParams.get('note'); // Reuse existing note ID
        } else {
            noteId = Math.random().toString(36).substr(2, 9); // Generate new note ID
        }

        // Save note to localStorage
        localStorage.setItem(noteId, noteContent);

        // Generate shareable link
        const shareLink = `${window.location.origin}?note=${noteId}`;
        document.getElementById('share-link').value = shareLink;

        // Show the share link section
        document.getElementById('note-link').classList.remove('hidden');
        alert('Note saved successfully!');
    });

    document.getElementById('copy-link').addEventListener('click', () => {
        const shareLinkInput = document.getElementById('share-link');

        // Select and copy the link
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
