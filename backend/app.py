from flask import Flask, request, jsonify
from bson.json_util import dumps
from werkzeug.utils import secure_filename
from s3_service import upload_file_to_s3, index_faces_in_image, search_faces_by_image, list_faces_in_collection, generate_presigned_url
from flask_cors import CORS
import hashlib
import boto3
import os
from dotenv import load_dotenv

from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from flask_pymongo import PyMongo

# Load environment variables
load_dotenv()



app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

uri = f"mongodb+srv://{os.getenv('MONGODB_USER')}:{os.getenv('MONGODB_PASSWORD')}@cluster0.2ssli.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

db = client['ZisionX']  # Replace 'ZisionX' with your actual database name
users_collection = db['users'] 

OTP = "66666"

# Check if user is registered
@app.route('/check-user', methods=['POST'])
def check_user():
    data = request.json
    mobile_number = data.get('mobile_number')

    # Query MongoDB for user by mobile number
    user = users_collection.find_one({"number": mobile_number})
    if user:
        return jsonify({"status": "registered", "user": dumps(user)}), 200
    else:
        new_user = {"number": mobile_number, "role": None}
        users_collection.insert_one(new_user)
        return jsonify({"status": "not_registered", "message": "User registered successfully!"}), 201
        

# Register a new user
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    mobile_number = data.get('mobile_number')
    
    # Check if user already exists
    if users_collection.find_one({"number": mobile_number}):
        return jsonify({"status": "error", "message": "User already exists!"}), 400
    
    # Register user
    new_user = {"number": mobile_number, "role": None}
    users_collection.insert_one(new_user)
    return jsonify({"status": "success", "message": "User registered successfully!"}), 201

# Update user role
@app.route('/update-role', methods=['POST'])
def update_role():
    data = request.json
    mobile_number = data.get('mobile_number')
    selected_role = data.get('role')

    # Update role in MongoDB
    users_collection.update_one({"number": mobile_number}, {"$set": {"role": selected_role}})
    return jsonify({"status": "success", "message": "Role updated successfully!"}), 200

# Verify OTP (Hardcoded for now)
@app.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    entered_otp = data.get('otp')

    if entered_otp == OTP:
        return jsonify({"status": "success", "message": "OTP verified!"}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid OTP!"}), 400


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
