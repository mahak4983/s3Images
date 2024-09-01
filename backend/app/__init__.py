from flask import Flask
from app.config import Config
import boto3

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize S3 client
    app.s3_client = boto3.client(
        's3',
        aws_access_key_id=app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=app.config['AWS_SECRET_ACCESS_KEY'],
    )

    # Register blueprints/routes
    from app.routes import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app
