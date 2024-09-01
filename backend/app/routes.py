from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename

main = Blueprint('main', __name__)

@main.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    filename = secure_filename(file.filename)
    s3_client = current_app.s3_client
    s3_client.upload_fileobj(file, current_app.config['S3_BUCKET_NAME'], filename)
    
    return jsonify({"message": "Upload successful"}), 200
