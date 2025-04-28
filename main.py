import os
from app import app, db

def init_db():
    """Initialize the database and create tables."""
    with app.app_context():
        db.create_all()

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 5000))
    
    # Run the application
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    )
