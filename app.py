from flask import Flask, render_template, request
import cloudinary
import cloudinary.uploader  # Ensure this import is correct
from cloudinary import CloudinaryImage
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET"),
    secure=True
)

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def upload_image():
    if request.method == 'POST':
        file = request.files['file']
        facial_features = request.form['facial_features']
        theme = request.form['theme']
        costume = request.form['costume']

        if file:
            # Upload the image
            upload_result = cloudinary.uploader.upload(file)
            public_id = upload_result.get('public_id')
            original_url = upload_result.get('secure_url')

            if not public_id:
                return render_template('result.html', original_url=original_url, error_message="Failed to upload image.")

            try:
                # Apply transformations using CloudinaryImage
                image = CloudinaryImage(public_id)
                final_image_url = image.build_url(transformation=[
                    {"effect": f"gen_replace:from_clothes;to_{costume}'s clothes;preserve-geometry_true"},
                    {"effect": f"gen_background_replace:prompt_Add {theme} to the background"},
                    #{"effect": f"gen_replace:from_Subject's mouth;to_a {facial_features}'s halloween mouth;preserve-geometry_true"},
                    #{"effect": f"gen_replace:from_Subject's eyes;to_a {facial_features}'s halloween eyes;preserve-geometry_true"},
                    #{"effect": f"gen_replace:from_Subject's top of head only;to_a {facial_features}'s halloween hat or {facial_features}'s hair;preserve-geometry_true"},
                    #{"effect": f"gen_replace:from_Subject's ears;to_a {facial_features}'s halloween ears;preserve-geometry_true"}
                    #{"effect": f"gen_replace:from_Subject's hands;to_a {costume}'s hands holding wine in a glass and yogurt in the other hand;preserve-geometry_true"}
                ])

                #Notes
                # It would be funny to sa that holding the subject's real clothes in the from subject's clothes

                # Debugging: Print the final image URL
                print("Final Image URL:", final_image_url)

                # Simple check to ensure URL is valid
                if not final_image_url:
                    raise Exception("Generated URL is invalid.")

            except Exception as e:
                print("Error during transformation:", e)
                return render_template('result.html', original_url=original_url, error_message="An error occurred during image transformation.")

            # Render the result template
            return render_template('result.html', original_url=original_url, final_image_url=final_image_url)

    return render_template('upload.html')

if __name__ == '__main__':
    app.run(debug=True)
