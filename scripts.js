// scripts.js
document.addEventListener('DOMContentLoaded', () => {
    const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'), {
        backdrop: 'static',
        keyboard: false
    });

    document.getElementById('uploadForm').onsubmit = async function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('pdfFile');
        const file = fileInput.files[0];
        const url = 'https://qrcodegenbackend.fly.dev';

        if (!file) {
            alert('Please upload a PDF.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);

        // Show loading modal
        loadingModal.show();
        console.log('Loading modal displayed...');

        try {
            const response = await fetch(`${url}/upload`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response from server:', errorData);
                throw new Error(errorData.error || 'Upload failed.');
            }

            const data = await response.json();
            console.log('Response data:', data);

            if (data.qrUrl && data.publicUrl) {
                const qrImage = document.getElementById('qrCode');
                const downloadLink = document.getElementById('downloadLink');
                const downloadText = document.getElementById('downloadText');

                qrImage.src = data.qrUrl;
                downloadLink.href = data.qrUrl;
                downloadLink.innerText = 'Download Your QR Code';
                downloadText.innerText = 'Your QR code is ready to download.';

                document.getElementById('qrContainer').classList.remove('hidden');
                console.log('QR Code displayed.');
            } else {
                alert('Failed to generate QR code. Try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error uploading PDF: ' + error.message);
        } finally {
            // Hide loading modal
            loadingModal.hide();
            console.log('Loading modal hidden.');
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
