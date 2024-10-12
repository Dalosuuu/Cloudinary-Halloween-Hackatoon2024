// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const button = form.querySelector('button');
    const loading = document.getElementById('loading');
    const loadingMessage = document.getElementById('loadingMessage');

    const messages = {
        upload: [
            "Sending image to server...",
            "Uploading your spooky selfie...",
            "Preparing your image for transformation..."
        ],
        theme: [
            "Creating the theme...",
            "Adding some Halloween magic...",
            "Spookifying the background..."
        ],
        costume: [
            "Making sure you are not naked...",
            "Dressing you up in style...",
            "Finding the perfect costume..."
        ]
    };

    function getRandomMessage(type) {
        const msgs = messages[type];
        return msgs[Math.floor(Math.random() * msgs.length)];
    }

    form.addEventListener('submit', function(event) {
        const fileInput = form.querySelector('input[type="file"]');
        const selects = form.querySelectorAll('select');

        let valid = true;

        if (!fileInput.files.length) {
            alert('Please select an image.');
            valid = false;
        }

        selects.forEach(select => {
            if (!select.value) {
                alert('Please select an option for ' + select.name.replace('_', ' ') + '.');
                valid = false;
            }
        });

        if (!valid) {
            event.preventDefault();
        } else {
            button.disabled = true;
            loading.style.display = 'block';
            loadingMessage.textContent = getRandomMessage('upload');

            setTimeout(() => {
                loadingMessage.textContent = getRandomMessage('theme');
            }, 2000);

            setTimeout(() => {
                loadingMessage.textContent = getRandomMessage('costume');
            }, 4000);
        }
    });
});
