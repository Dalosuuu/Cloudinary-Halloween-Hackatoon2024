from flask import Flask, render_template, request, jsonify, send_from_directory
import cloudinary
import cloudinary.uploader  # Ensure this import is correct
from cloudinary import CloudinaryImage
from dotenv import load_dotenv
import os
from waitress import serve
import requests
import base64

# Load environment variables
load_dotenv()

cert_crt_path = os.path.join(os.getcwd(), 'cloudinary_cert.crt')

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36'
}

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
    sign_url=True
)

app = Flask(__name__)

app.config['CUSTOM_STATIC_PATH'] = "node_modules/flowbite/dist/"

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        public_id = "kk0hbslf4ohvt2duru3w" #request.form.get("public_id")
        theme = request.form.get("theme")
        costume = request.form.get("costume")

        if public_id:
                # Apply transformations using CloudinaryImage
                image = CloudinaryImage(public_id)
                final_image_url = image.build_url(
                    transformation=[
                        {"width": 300, "crop": "scale", "fetch_format": "auto"},
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
                
                img_response = requests.get(final_image_url, headers=headers, verify=cert_crt_path)
                if img_response.status_code == 423:
                    img_response = requests.get(final_image_url, headers=headers, verify=cert_crt_path)

                if img_response.status_code == 200:
                    img_base64 = base64.b64encode(img_response.content).decode('utf-8')                    
                else:
                    print("Error during transformation: Please, try another picture")
                    return render_template(
                        "result.html",
                        original_url=f"https://res.cloudinary.com/{_env.cloud_name}/image/upload/{public_id}",
                        error_message="An error occurred during image transformation.",
                    )  
                # Render the result template
                return render_template(
                    "result.html",
                    original_url=f"https://res.cloudinary.com/{_env.cloud_name}/image/upload/{public_id}",
                    final_image_url=img_base64,
                )
    return render_template("index.html")

@app.route("/upload", methods=["GET"])
def upload_image():
    return render_template(
        "upload.html",
        cloud_name=_env.cloud_name,
        upload_preset=_env.upload_preset,
    )

@app.route('/cdn/<path:filename>')
def custom_static(filename):
    return send_from_directory(app.config['CUSTOM_STATIC_PATH'], filename)

if __name__ == "__main__":
    if not _env.port:
        app.run(debug=True)
    else:
        serve(app, host='0.0.0.0', port=_env.port)