# Halloween Image Transformation App

This is a Flask web application that allows users to upload an image and apply Halloween-themed transformations using Cloudinary.

## Features

- Upload an image and select various Halloween-themed transformations.
- Transformations include changing facial features, themes, and costumes.
- View the original and transformed images.

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
   ```

## Usage

1. Run the Flask application:

   ```bash
   python app.py
   ```

2. Open your web browser and go to `http://127.0.0.1:5000` to access the application.

## File Structure

- `app.py`: Main application file.
- `templates/`: Contains HTML templates for the application.
- `static/`: Contains static files like CSS and JavaScript.

## License

This project is licensed under the MIT License.
