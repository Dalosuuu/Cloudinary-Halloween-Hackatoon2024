# Halloween Image Transformation App

This is a Flask web application that allows users to upload an image and apply Halloween-themed transformations using Cloudinary's AI capabilities.

## Features

- Upload an image using Cloudinary's upload widget for easier image selection and more upload sources.
- Apply AI-powered Halloween-themed transformations with multiple default options.
- View the original and transformed images.
- Share the transformed image on various social media platforms.
- Copy link functionality for easy sharing.
- UI with loading animations and responsive design.

## Requirements

- Python 3.x
- Flask
- Cloudinary
- python-dotenv

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Dalosuuu/Cloudinary-Halloween-Hackatoon.git
   cd Cloudinary-Halloween-Hackatoon
   ```
>[!TIP]
>2. Install the dependencies:

   ```bash
   pip install -r requirements.txt
   ```

>[!NOTE]
>3. Create a `.env` file in the root directory and fill it with your Cloudinary credentials:

   ```
   CLOUD_NAME=your_cloud_name
   API_KEY=your_api_key
   API_SECRET=your_api_secret
   UPLOAD_PRESET=your_upload_preset_name
   PORT= #optional
   ```

>[!IMPORTANT]
>4. Configure the Upload Preset in Cloudinary with the following settings:

   ```
   Upload preset name: (Equals to **UPLOAD_PRESET** in .env file)
   Signing Mode: Signed
   Incoming Transformation: c_crop,g_custom
   ```
   ![Upload Preset Settings](/RdmeImages/upload_preset_settings.png)

## Usage

1. Run the Flask application:

   ```bash
   python app.py
   ```

2. Open your web browser and go to `http://127.0.0.1:5000` to access the application.

3. In the index page, click on "Get Started" to access the upload page.

4. Click on the "Upload Image" button to select and upload an image using Cloudinary's widget.

5. Once the image is uploaded, select the desired transformations and click "Upload and Transform".

6. View your transformed image and use the sharing buttons to share it on social media.

## Project Structure

- `app.py`: Main application file.
- `templates/`: Contains HTML templates for the application.
  - `index.html`: Home page with a link to the upload page.
  - `upload.html`: Page displaying the upload widget and transformation options.
  - `result.html`: Page displaying the transformed image and sharing options.
- `static/`: Contains static files like CSS and JavaScript.
  - `styles.css`: Main stylesheet for the application.
  - `script.js`: JavaScript for handling image upload and form submission.
  - `result.js`: JavaScript for handling the result page functionality.


## License

This project is licensed under the MIT License.
