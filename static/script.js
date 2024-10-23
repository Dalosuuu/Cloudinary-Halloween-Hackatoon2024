// script.js
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('uploadForm');
    const button = form.querySelector('button[type="submit"]');
    const cloudinaryButton = document.getElementById('cloudinaryUploadButton');
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
                document.getElementById('after').classList.remove('hidden');
                const resultContainer = document.querySelector('[id="photo_grid"]'); // Target the div
                resultContainer.innerHTML = "";
                resultBlock2.appendChild(originalImage)
            }
        });
    });
    function load_img(url,imageElement,i,maxIntentos) {
        if (i < maxIntentos) {
            console.log(`Intentando cargar la imagen... Intento ${i}`);
            fetch(url, { method: 'GET' }).then(response => {
                if (response.ok) {
                } else if (response.status === 423) {
                    load_img(url);
                } else if (response.status === 400) {
                    return "{{ url_for('static', filename='images/image.png') }}";
                    console.log('Error 400: Solicitud incorrecta (Bad Request).');
                } else {
                    return "{{ url_for('static', filename='images/image.png') }}";
                    console.log(`Error ${response.status}: ${response.statusText}`);
                }
            }
            ).catch(error => {
                return "{{ url_for('static', filename='images/image.png') }}";
                console.log('Ocurrió un error al intentar cargar la imagen:', error);
            });
        }
        return ;
    }
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        let valid = true;

        // if (!publicIdInput.value) {
        //     alert('Please upload an image.');
        //     valid = false;
        // }

        if (valid) {
            button.disabled = true;
            console.log("Valid Form")
            const resultContainer = document.querySelector('[id="photo_grid"]'); // Target the div
            resultContainer.innerHTML = "";
            document.getElementById('after').classList.add('hidden');
            // document.getElementById('loanding').classList.remove('hidden');
            // document.getElementById('loanding').classList.add('flex');
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

                        document.getElementById('loanding').classList.remove('hidden');
            document.getElementById('loanding').classList.add('flex');
                        data.url_lists.forEach((url,i) => {
                            const imageElement = document.createElement('img');
                            imageElement.src = url; // Set the new image URL
                            imageElement.alt = 'Error'; // Alt text for accessibility
                            imageElement.classList.add('w-full', 'rounded-lg'); // Tailwind classes for full width and rounded corners
                            let aurl = load_img(url,imageElement,i,data.url_lists.length);
                            // if(!aurl){
                            //     imageElement.src = aurl;
                            // }
                            // Listener to increment loaded images count
                            imageElement.addEventListener('load', function () {
                            //     imagesLoaded++;

                            //     // Optionally check if all images are loaded
                                    console.log('All images have loaded!');
                                    // Perform any additional actions here
                                    button.disabled = false;
                                    imagesLoaded = 0;
                                    document.getElementById('photo_grid').classList.remove('hidden');
                                    document.getElementById('photo_grid').classList.add('grid');
                                    document.getElementById('loanding').classList.remove('flex');
                                    document.getElementById('loanding').classList.add('hidden');
                            });
                            // Append the new image to the photo container
                            resultContainer.appendChild(imageElement);
                        });

                    }
                    // Hide loading spinner and re-enable the button
                    // button.disabled = false;
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
    )
});