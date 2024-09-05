from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import boto3
import os


main = Blueprint('main', __name__)

@main.route('/upload', methods=['POST'])
def upload_file():
    if 'files' not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist('files')  # Get all files with the 'files' key
    if not files:
        return jsonify({"error": "No files selected"}), 400

    uploaded_files = []
    for file in files:
        if file.filename == '':
            continue  # Skip empty filenames

        filename = secure_filename(file.filename)
        s3_client = boto3.client(
        's3',
        aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
        aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    )
        s3_client.upload_fileobj(file, "zisionimages", filename)
        uploaded_files.append(filename)

    return jsonify({"message": "Files uploaded successfully", "uploaded_files": uploaded_files}), 200
    # if 'file' not in request.files:
    #     return jsonify({"error": "No file part"}), 400
    # file = request.files['file']
    # if file.filename == '':
    #     return jsonify({"error": "No selected file"}), 400
    
    # filename = secure_filename(file.filename)
    # s3_client = current_app.s3_client
    # s3_client.upload_fileobj(file, current_app.config['S3_BUCKET_NAME'], filename)
    
    # return jsonify({"message": "Upload successful"}), 200
