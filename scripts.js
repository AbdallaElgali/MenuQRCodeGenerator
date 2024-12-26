// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').onsubmit = async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('pdfFile');
        const file = fileInput.files[0];
        const url = 'http://localhost:3000';

        if (!file) {
            alert('Please upload a PDF.');
            return;
        }

        const validExtension = file.name.endsWith('.pdf');

        if (!validExtension || file.type !== 'application/pdf') {
            alert('Invalid file type. Only PDF files are allowed.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        try {
            const response = await fetch(`${url}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed.');
            }

            const data = await response.json();

            if (data.qrUrl && data.publicUrl) {
                const qrImage = document.getElementById('qrCode');
                const downloadLink = document.getElementById('downloadLink');
                const downloadText = document.getElementById('downloadText');

                qrImage.src = data.qrUrl;
                downloadLink.href = data.qrUrl;
                downloadLink.innerText = 'Download Your QR Code';
                downloadText.innerText = 'Your file is ready to download.';

                document.getElementById('qrContainer').classList.remove('hidden');
            } else {
                alert('Failed to generate QR code or retrieve PDF URL. Try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading PDF: ' + error.message);
        }
    };
});

// Drag and Drop Validation
document.addEventListener('DOMContentLoaded', () => {
    const dropArea = document.getElementById('uploadForm');
    dropArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropArea.classList.add('drag-over');
    });

    dropArea.addEventListener('dragleave', () => {
        dropArea.classList.remove('drag-over');
    });

    dropArea.addEventListener('drop', (e) => {
        e.preventDefault();
        dropArea.classList.remove('drag-over');

        const file = e.dataTransfer.files[0];
        if (!file.name.endsWith('.pdf') || file.type !== 'application/pdf') {
            alert('Invalid file type. Only PDF files are allowed.');
            return;
        }
        const fileInput = document.getElementById('pdfFile');
        fileInput.files = e.dataTransfer.files;
    });
});
