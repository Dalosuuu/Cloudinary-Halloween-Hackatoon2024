// script.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const button = form.querySelector('button[type="submit"]');
    const cloudinaryButton = document.getElementById('cloudinaryUploadButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const publicIdInput = document.getElementById('publicIdInput');

    // These values are now provided directly in the HTML template
    const cloudName = document.getElementById('cloudName').value;
    const uploadPreset = document.getElementById('uploadPreset').value;

    cloudinaryButton.addEventListener('click', function() {
        cloudinary.openUploadWidget({
            cloudName: cloudName,
            uploadPreset: uploadPreset,
            sources: ['local', 'camera', 'google_drive', 'dropbox', 'image_search'],
            multiple: false,
            cropping: true,
            croppingAspectRatio: 1,
            croppingShowDimensions: true,
            croppingValidateDimensions: true,
            showAdvancedOptions: true
        }, (error, result) => {
            if (error) {
                console.error('Upload error:', error);
                alert('An error occurred during upload. Please try again.');
            } else if (result && result.event === "success") {
                const fileUrl = result.info.secure_url;
                const publicId = result.info.public_id;
                
                if (fileNameDisplay) {
                    fileNameDisplay.textContent = `Selected: ${result.info.original_filename}`;
                    fileNameDisplay.style.color = '#f0e68c'; // Ensure text is visible
                } else {
                    console.warn('fileNameDisplay element not found');
                }
                
                if (publicIdInput) {
                    publicIdInput.value = publicId;
                } else {
                    console.warn('publicIdInput element not found');
                }
                
                console.log('File URL:', fileUrl);
                console.log('Public ID:', publicId);
                
                // Enable the submit button after successful upload
                const submitButton = document.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = false;
                }
            }
        });
    });

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        let valid = true;

        // if (!publicIdInput.value) {
        //     alert('Please upload an image.');
        //     valid = false;
        // }

        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            if (!select.value) {
                alert('Please select an option for ' + select.name.replace('_', ' ') + '.');
                valid = false;
            }
        });

        if (valid) {
            button.disabled = true;
            loading.style.display = 'block';

            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (response.headers.get('content-type').includes('application/json')) {
                    return response.json();
                } else {
                    return response.text().then(html => {
                        document.open();
                        document.write(html);
                        document.close();
                        throw new Error('Redirected to result page');
                    });
                }
            })
            .then(data => {
                if (data.error) {
                    throw new Error(data.error);
                }
                window.location.href = data.redirect;
            })
            .catch(error => {
                if (error.message !== 'Redirected to result page') {
                    console.error('Error:', error);
                    alert('An error occurred during transformation: ' + error.message);
                    button.disabled = false;
                    loading.style.display = 'none';
                }
            });

        }
    });

});
