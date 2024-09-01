import boto3
from flask import current_app

def upload_file_to_s3(file, filename):
    s3_client = current_app.s3_client
    s3_client.upload_fileobj(file, current_app.config['S3_BUCKET_NAME'], filename)
