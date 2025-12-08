import os
from dotenv import load_dotenv

load_dotenv()

# Database
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("SECRET_KEY")

# Environment
ENV = os.getenv("FLASK_ENV", "development")

# CORS - Allow frontend origins
if ENV == "production":
    CORS_ORIGINS = [
        "https://sandramuschkorgel.github.io", 
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
else:
    CORS_ORIGINS = [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
