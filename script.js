document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('doc-iframe');
    
    // Fetch document URL from the server
    fetch('/api/get-doc-url')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            iframe.src = data.url; // Set the iframe source to the document URL
        })
        .catch(error => {
            console.error('Error fetching document URL:', error);
            alert('Failed to load document. Please try again later.');
        });
});
