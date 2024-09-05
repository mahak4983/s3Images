from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from s3_service import upload_file_to_s3, index_faces_in_image, search_faces_by_image, detect_faces_in_image
from flask_cors import CORS
import boto3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()



app = Flask(__name__)

CORS(app)


@app.route('/uploadsss', methods=['POST'])
def upload_multiple_files():
    """
    Endpoint to upload multiple files to AWS S3 and return their URLs.
    """
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400

    files = request.files.getlist('files')  # Get all files with the 'files' key
    if not files:
        return jsonify({"error": "No files selected"}), 400

    uploaded_files = []
    face_indexing_results = []
    for file in files:
        if file.filename == '':
            continue  # Skip empty filenames

        # Secure the filename
        filename = secure_filename(file.filename)

        try:
            # Upload file to S3
            file_url = upload_file_to_s3(file, filename)

            uploaded_files.append(file_url)
            indexing_result = index_faces_in_image("zisionimages", filename)
            face_indexing_results.append({
                "filename": filename,
                "indexing_result": indexing_result
            })
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    return jsonify({
        "message": "Files uploaded and faces indexed successfully",
        "uploaded_files": uploaded_files,
        "face_indexing_results": face_indexing_results
    }), 200

@app.route('/upload', methods=['POST'])
def get_image():
    """
    Endpoint to find and return images from S3 that contain the same face as the provided image.
    """
    # if 'file' not in request.files:
    #     return jsonify({"error": "No file part in the request"}), 400

    # file = request.files['file']  # Get the file from the request
    # if file.filename == '':
    #     return jsonify({"error": "No file selected"}), 400
    if 'files' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400

    files = request.files.getlist('files')  # Get all files with the 'files' key
    if not files:
        return jsonify({"error": "No files selected"}), 400

    # Secure the filename
    file = files[0]
    filename = secure_filename(file.filename)

    try:
        # Upload the provided file to S3
        # file_url = upload_file_to_s3(file, filename)

        # Detect faces in the provided image
        # face_ids = detect_faces_in_image("zisionimages", filename)

        # # If no faces detected, return empty response
        # if not face_ids:
        #     return jsonify({"message": "No faces detected in the provided image."}), 200

        # Search for matching faces in the collection
        matches = search_faces_by_image("zisionimages", filename)

        # Get URLs of matching images from S3
        matching_images = []
        for match in matches:
            face_id = match['Face']['FaceId']
            matching_images.append({
                "face_id": face_id,
                "similarity": match['Similarity']
            })

        return jsonify({
            "message": "Matching images found",
            "matching_images": matching_images
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
