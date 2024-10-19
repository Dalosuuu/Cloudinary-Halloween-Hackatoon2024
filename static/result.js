document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('tryAnotherButton');
    const loading = document.getElementById('loading');
    const loadingMessage = document.getElementById('loadingMessage');
    const cloudinaryImage = document.getElementById('cloudinary-id');

    const messages = [
        "Sending image to server...",
        "Uploading your spooky selfie...",
        "Preparing your image for transformation...",
        "Creating the theme...",
        "Adding some Halloween magic...",
        "Spookifying the background...",
        "Making sure you are not naked...",
        "Dressing you up in style...",
        "Finding the perfect costume..."
    ];

    function getRandomMessage() {
        return messages[Math.floor(Math.random() * messages.length)];
    }

    // Hide the button initially and show loading
    if (button) {
        button.style.display = 'none';
    }
    loading.style.display = 'block';
    loadingMessage.textContent = getRandomMessage();

    let messageInterval = setInterval(() => {
        loadingMessage.textContent = getRandomMessage();
    }, 2000);

    // Show the button when the Cloudinary image has loaded
    if (cloudinaryImage) {
        cloudinaryImage.addEventListener('load', function() {
            clearInterval(messageInterval);
            loading.style.display = 'none';
            if (button) {
                button.style.display = 'block';
            }
        });
    }

    if (button) {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            window.location.href = '/';
        });
    }
});
