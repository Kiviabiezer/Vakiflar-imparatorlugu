import os

class Config:
    """Application configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    # Handle Postgres URL format for Vercel
    database_url = os.environ.get('POSTGRES_URL')
    if database_url:
        SQLALCHEMY_DATABASE_URI = database_url
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///vakiflar.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
