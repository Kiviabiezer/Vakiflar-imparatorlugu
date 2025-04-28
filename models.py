from datetime import datetime
from typing import Dict, Any, Optional

from flask_login import UserMixin
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
import json

db = SQLAlchemy()

class User(UserMixin, db.Model):
    """User model for authentication and game progress tracking."""
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    game_saves = db.relationship('GameSave', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self) -> str:
        return f'<User {self.username}>'

class GameSave(db.Model):
    """Game save data model for storing player progress."""
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, index=True)
    save_name = db.Column(db.String(64), nullable=False)
    data = db.Column(db.Text, nullable=False)  # JSON data
    created_at = db.Column(db.DateTime, default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self) -> str:
        return f'<GameSave {self.save_name} (User: {self.user_id})>'

    def get_game_state(self) -> Dict[str, Any]:
        """Convert the stored JSON data to a Python dictionary.
        
        Returns:
            Dict[str, Any]: The game state as a dictionary
        
        Raises:
            json.JSONDecodeError: If the stored data is not valid JSON
        """
        return json.loads(self.data)
    
    def set_game_state(self, game_state: Dict[str, Any]) -> None:
        """Convert a Python dictionary to JSON data for storage.
        
        Args:
            game_state (Dict[str, Any]): The game state to store
            
        Raises:
            TypeError: If game_state is not JSON serializable
        """
        self.data = json.dumps(game_state)
        self.updated_at = datetime.utcnow()