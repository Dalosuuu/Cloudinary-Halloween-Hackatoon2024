from flask import Flask, render_template, request, jsonify
import cloudinary
import cloudinary.uploader  # Ensure this import is correct
from cloudinary import CloudinaryImage
from dotenv import load_dotenv
import os
import time
import hashlib
import hmac
from cloudinary import utils as cloudinary_utils
from waitress import serve

# Load environment variables
load_dotenv()

class _env:
    """Enviroment variables here..."""
    def __init__(self, cloud_name, api_key, api_secret, upload_preset, port):
        
        self.cloud_name = cloud_name
        self.api_key = api_key
        self.api_secret = api_secret
        self.upload_preset = upload_preset
        self.port = port
    
    cloud_name = os.getenv("CLOUD_NAME")
    api_key = os.getenv("API_KEY")
    api_secret = os.getenv("API_SECRET")
    upload_preset = os.getenv("UPLOAD_PRESET")
    port = os.getenv("PORT")

# Configure Cloudinary
cloudinary.config(
    cloud_name=_env.cloud_name,
    api_key=_env.api_key,
    api_secret=_env.api_secret,
    secure=True,
)

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        public_id = request.form.get("public_id")
        theme = request.form.get("theme")
        costume = request.form.get("costume")

        if public_id:
            try:
                # Apply transformations using CloudinaryImage
                image = CloudinaryImage(public_id)
                final_image_url = image.build_url(
                    transformation=[
                        {"width": 300, "crop": "scale"},
                        {"effect": f"upscale"},
                        {
                            "effect": f"gen_replace:from_clothes;to_{costume}'s clothes;preserve-geometry_true"
                        },
                        {
                            "effect": f"gen_background_replace:prompt_Add {theme} to the background"
                        },
                        {
                            "effect": "enhance"
                        },
                        # {"effect": f"gen_replace:from_Subject's hands;to_a {costume}'s hands holding wine in a glass and yogurt in the other hand;preserve-geometry_true"}
                    ]
                )
                # Notes
                # Debugging: Print the final image URL
                print("Final Image URL:", final_image_url)

            except Exception as e:
                print("Error during transformation:", e)
                return render_template(
                    "result.html",
                    original_url=f"https://res.cloudinary.com/{_env.cloud_name}/image/upload/{public_id}",
                    error_message="An error occurred during image transformation.",
                )

            # Render the result template
            return render_template(
                "result.html",
                original_url=f"https://res.cloudinary.com/{_env.cloud_name}/image/upload/{public_id}",
                final_image_url=final_image_url,
            )
    return render_template("index.html")

@app.route("/upload", methods=["GET"])
def upload_image():
    return render_template(
        "upload.html",
        cloud_name=_env.cloud_name,
        upload_preset=_env.upload_preset,
        api_key=_env.api_key
    )

@app.route("/signature", methods=["GET"])
def get_signature():
    params = {k: v for k, v in request.args.items()}
    params['timestamp'] = int(time.time())
    params['upload_preset'] = _env.upload_preset
    
    signature = cloudinary_utils.api_sign_request(params, _env.api_secret)
    
    return jsonify(
        signature=signature,
        timestamp=params['timestamp'],
        api_key=_env.api_key,
        cloud_name=_env.cloud_name,
        upload_preset=_env.upload_preset
    )

if __name__ == "__main__":
    if not _env.port:
        app.run(debug=True)
    else:
        serve(app, host='0.0.0.0', port=_env.port)