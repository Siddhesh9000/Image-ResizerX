document.addEventListener('DOMContentLoaded', function () {
    // Function to display the selected image
    document.getElementById('image-input').addEventListener('change', function () {
        const imageContainer = document.getElementById('image-container');
        const uploadedImage = document.getElementById('uploaded-image');
        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressText = document.getElementById('progress-text');
        const file = this.files[0];

        if (file) {
            const reader = new FileReader();
            const intervalDuration = 50; // Interval duration in milliseconds

            let currentPercentage = 0;

            reader.onprogress = function (event) {
                const total = event.total;
                const loaded = event.loaded;
                currentPercentage = Math.round((loaded / total) * 100);
                progressBarFill.style.width = currentPercentage + '%';
                progressText.textContent = 'Uploaded: ' + currentPercentage + '%';
            };

            reader.onloadstart = function () {
                progressBarFill.style.width = '0%';
                progressText.textContent = 'Uploaded: 0%';
                currentPercentage = 0;
            };

            reader.onload = function (e) {
                uploadedImage.src = e.target.result;
                imageContainer.classList.remove('hidden');
                imageContainer.classList.add('opacity-100');
                progressBarFill.style.width = '100%';
                progressText.textContent = 'Uploaded: 100%';
            };

            reader.onerror = function () {
                alert("Error occurred while reading the file.");
            };

            reader.readAsDataURL(file);
        } else {
            imageContainer.classList.remove('opacity-100');
            imageContainer.classList.add('hidden');
        }
    });

    // Function to resize the image to specific dimensions when a button is clicked
    document.getElementById('resize-button-instagram').addEventListener('click', function () {
        resizeImage(1080, 1080);
    });

    document.getElementById('resize-button-facebook').addEventListener('click', function () {
        resizeImage(1200, 630);
    });

    document.getElementById('resize-button-twitter').addEventListener('click', function () {
        resizeImage(1200, 675);
    });

    document.getElementById('resize-button-website').addEventListener('click', function () {
        resizeImage(600, 300);
    });

    // Function to resize the image
    function resizeImage(width, height) {
        const uploadedImage = document.getElementById('uploaded-image');

        // Set the width and height of the image
        uploadedImage.width = width;
        uploadedImage.height = height;
    }
});
