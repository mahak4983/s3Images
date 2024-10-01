from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
from s3_service import upload_file_to_s3, index_faces_in_image, search_faces_by_image, list_faces_in_collection, generate_presigned_url
from flask_cors import CORS
import hashlib
import boto3
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()



app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

def calculate_file_hash(file):
    """
    Calculate the MD5 hash of the file content.
    """
    hash_md5 = hashlib.md5()
    for chunk in iter(lambda: file.read(4096), b""):
        hash_md5.update(chunk)
    file.seek(0)  # Reset the file pointer after reading
    return hash_md5.hexdigest()


@app.route('/upload', methods=['POST'])
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

@app.route('/getimage', methods=['POST'])
def get_image():
    """
    Endpoint to find and return images from S3 that contain the same face as the provided image.
    """
    # if 'file' not in request.files:
    #     return jsonify({"error": "No file part in the request"}), 400

    # file = request.files['file']  # Get the file from the request
    # if file.filename == '':
    #     return jsonify({"error": "No file selected"}), 400
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

# Retrieve the single file with the 'file' key
    file = request.files['file']  

    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    # Secure the filename
    filename = secure_filename(file.filename)

    image_bytes = file.read()


    try:
        # Upload the provided file to S3
        # file_url = upload_file_to_s3(file, filename)

        # Detect faces in the provided image
        # face_ids = detect_faces_in_image("zisionimages", filename)

        # # If no faces detected, return empty response
        # if not face_ids:
        #     return jsonify({"message": "No faces detected in the provided image."}), 200

        # Search for matching faces in the collection
        matches = search_faces_by_image("zisionimages", image_bytes)

        all_faces = list_faces_in_collection()


        # Get URLs of matching images from S3
        matching_images = []
        for match in matches:
            face_id = match['Face']['FaceId']
            # Find the corresponding face in the collection
            for face in all_faces:
                if face['FaceId'] == face_id:
                    s3_object_key = face['ExternalImageId']  # Assuming the ExternalImageId is the S3 object key
                    s3_url = generate_presigned_url("zisionimages", s3_object_key)
                    matching_images.append({
                        "face_id": face_id,
                        "similarity": match['Similarity'],
                        "s3_url": s3_url
                    })
                    break

        return jsonify({
            "message": "Matching images found",
            "matching_images": matching_images
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
