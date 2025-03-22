import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Telegram Bot API Token
TELEGRAM_TOKEN = os.getenv("TELEGRAM_TOKEN")

# Backend API URL
API_BASE_URL = os.getenv("API_BASE_URL", "http://localhost:8000")

# Validate that important environment variables are set
if not TELEGRAM_TOKEN:
    raise ValueError("TELEGRAM_TOKEN environment variable is not set")
