// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const button = form.querySelector('button[type="submit"]');
    const cloudinaryButton = document.getElementById('cloudinaryUploadButton');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    const publicIdInput = document.getElementById('publicIdInput');

    // These values are now provided directly in the HTML template
    const cloudName = document.getElementById('cloudName').value;
    const uploadPreset = document.getElementById('uploadPreset').value;
    const apiKey = document.getElementById('apiKey').value;

    cloudinaryButton.addEventListener('click', function () {
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
                const resultBlock2 = document.querySelector('[data-id="16"]')

                resultBlock2.innerHTML = ``;

                const originalImage = document.createElement('img');
                originalImage.src = fileUrl; // Set the new image URL
                originalImage.alt = 'Transformed Image'; // Alt text for accessibility
                originalImage.classList.add('w-full', 'rounded-lg'); // Tailwind classes for full width and rounded corners

                resultBlock2.appendChild(originalImage)
            }
        });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let valid = true;

        if (!publicIdInput.value) {
            alert('Please upload an image.');
            valid = false;
        }

        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            if (!select.value) {
                alert('Please select an option for ' + select.name.replace('_', ' ') + '.');
                valid = false;
            }
        });

        if (valid) {
            button.disabled = true;
            console.log("Valid Form")
            document.getElementById('after').classList.add('hidden');
            document.getElementById('loanding').classList.remove('hidden');
            document.getElementById('loanding').classList.add('flex');
            document.getElementById('photo_grid').classList.add('hidden');


            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    if (data.error) {
                        throw new Error(data.error);
                    }
  
                // If the data includes a list of image URLs
                if (data.url_lists && Array.isArray(data.url_lists)) {

                    const resultContainer = document.querySelector('[id="photo_grid"]'); // Target the div

                    let imagesLoaded = 0; // Counter for loaded images

                    data.url_lists.forEach(url => {
                        const imageElement = document.createElement('img');
                        imageElement.src = url; // Set the new image URL
                        imageElement.alt = 'Transformed Image'; // Alt text for accessibility
                        imageElement.classList.add('w-full', 'rounded-lg'); // Tailwind classes for full width and rounded corners
                    
                        // Listener to increment loaded images count
                        imageElement.addEventListener('load', function() {
                            imagesLoaded++;
                            const counterElement = document.getElementsByName('counter')[0]; // Get the first element
                            counterElement.value = parseInt(counterElement.value) - 1; // Decrement the counter
                            
                            // Optionally check if all images are loaded
                            if (imagesLoaded === data.url_lists.length) {
                                console.log('All images have loaded!');
                                // Perform any additional actions here
                                imagesLoaded = 0;
                                document.getElementById('photo_grid').classList.remove('hidden');
                                document.getElementById('photo_grid').classList.add('grid');
                                document.getElementById('loanding').classList.remove('flex');
                                document.getElementById('loanding').classList.add('hidden');
                            }
                        });
                    
                        // Append the new image to the photo container
                        resultContainer.appendChild(imageElement);
                    });
                 
                }
                    // Hide loading spinner and re-enable the button
                    button.disabled = false;
                    loading.style.display = 'none';
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
    }
)});