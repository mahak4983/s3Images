import boto3
from botocore.exceptions import NoCredentialsError, ClientError
import os
from botocore.config import Config

# Initialize the S3 client with credentials
s3 = boto3.client(
    's3',
    config=Config(signature_version='s3v4'),
    region_name='ap-south-1'
)



rekognition = boto3.client(
    'rekognition',
    region_name='ap-south-1'
)

def create_s3_bucket(bucket_name):
    """
    Create a new S3 bucket.
    
    :param bucket_name: The name of the bucket to be created
    """
    try:
        s3.create_bucket(
            Bucket=bucket_name,
            CreateBucketConfiguration={
                'LocationConstraint': 'ap-south-1'  # Adjust the region as per your setup
            }
        )
        print(f"S3 bucket {bucket_name} created successfully.")
    except Exception as e:
        print(f"Error creating S3 bucket: {e}")
        raise e


def create_rekognition_collection(collection_id):
    """
    Create a new Rekognition collection.
    
    :param collection_id: The collection ID (e.g., the user's mobile number)
    """
    try:
        rekognition.create_collection(CollectionId=collection_id)
        print(f"Rekognition collection {collection_id} created successfully.")
    except Exception as e:
        print(f"Error creating Rekognition collection: {e}")
        raise e


def check_if_image_exists_by_hash(bucket_name, file_hash):
    """
    Check if an image with the given hash already exists in S3.
    We assume that the hash is used as the filename in this case.
    """
    try:
        s3.head_object(Bucket=bucket_name, Key=file_hash)
        return True  # Image with this hash exists
    except ClientError as e:
        if e.response['Error']['Code'] == '404':
            return False  # Image does not exist
        else:
            # Handle other possible errors (permissions, etc.)
            raise e


def upload_file_to_s3(file, filename, bucket_name="zisionimages"):
    """
    Uploads a file to an S3 bucket.

    :param file: File object from Flask request
    :param filename: Secure filename to be used for saving in S3
    :param bucket_name: The target S3 bucket name
    :return: URL of the uploaded file or raises an error if upload fails
    """
    try:
        transfer_config = boto3.s3.transfer.TransferConfig(
            multipart_threshold=5 * 1024 * 1024,  # 5MB threshold
            max_concurrency=10,
            multipart_chunksize=5 * 1024 * 1024  # 5MB chunks
        )
        s3.upload_fileobj(
            file,
            bucket_name,
            filename,
            Config=transfer_config
        )

        # Return the URL of the uploaded file
        file_url = f"https://{bucket_name}.s3.amazonaws.com/{filename}"
        return file_url

    except NoCredentialsError:
        raise Exception("AWS credentials not available.")
    except ClientError as e:
        raise Exception(f"Failed to upload file to S3: {e}")
    
def index_faces_in_image(bucket_name, filename, collection_id='my_face_collection'):
    """
    Index faces in an image stored in S3 using AWS Rekognition.

    :param bucket_name: The name of the S3 bucket
    :param filename: The name of the file in the S3 bucket
    :param collection_id: The Rekognition collection ID
    :return: Response from Rekognition or raises an error if indexing fails
    """
    try:
        external_image_id = f"{bucket_name}_{filename}"
        response = rekognition.index_faces(
            CollectionId=collection_id,
            Image={
                'S3Object': {
                    'Bucket': bucket_name,
                    'Name': filename
                }
            },
            DetectionAttributes=['ALL'],
            MaxFaces=5,  # Maximum number of faces to index (optional)
            QualityFilter='AUTO',
            ExternalImageId=external_image_id
        )

        face_records = response['FaceRecords']
        face_ids = [face['Face']['FaceId'] for face in face_records]

        return face_ids

    except ClientError as e:
        raise Exception(f"Failed to index faces: {e}")
    
def detect_faces_in_image(bucket_name, filename):
    """
    Detect faces in an image stored in S3 using AWS Rekognition.

    :param bucket_name: The name of the S3 bucket
    :param filename: The name of the file in the S3 bucket
    :return: List of face IDs detected in the image
    """
    try:
        response = rekognition.detect_faces(
            Image={
                'S3Object': {
                    'Bucket': bucket_name,
                    'Name': filename
                }
            },
            Attributes=['ALL']
        )

        face_ids = [face['FaceId'] for face in response.get('FaceDetails', [])]
        return face_ids

    except ClientError as e:
        raise Exception(f"Failed to detect faces: {e}")

def search_faces_by_image(bucket_name, image_bytes, collection_id='my_face_collection'):
    """
    Search for faces in a Rekognition collection using the provided image.

    :param bucket_name: The name of the S3 bucket
    :param filename: The name of the file in the S3 bucket
    :param collection_id: The Rekognition collection ID
    :return: List of matching faces with their S3 URLs
    """
    try:
        response = rekognition.search_faces_by_image(
            CollectionId=collection_id,
            Image={'Bytes': image_bytes},
            MaxFaces=5,
            FaceMatchThreshold=80
        )

        return response['FaceMatches']

    except ClientError as e:
        raise Exception(f"Failed to search faces: {e}")
    
def list_faces_in_collection(collection_id='my_face_collection'):
    """
    List all faces in a Rekognition collection and return their metadata.
    """
    try:
        response = rekognition.list_faces(
            CollectionId=collection_id,
            MaxResults=1000  # Adjust as needed
        )
        
        return response['Faces']

    except Exception as e:
        raise Exception(f"Failed to list faces in collection: {e}")

def generate_presigned_url(bucket_name, object_key, expiration=3600):
    try:
        url = s3.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': bucket_name,
                'Key': object_key,
                'ResponseContentDisposition': 'inline',
                'ResponseContentType': 'image/jpeg'  },
            ExpiresIn=expiration
        )
        return url
    except Exception as e:
        print(f"Error generating pre-signed URL: {str(e)}")
        return None
