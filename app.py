from flask import Flask, jsonify, request, render_template, send_from_directory
import os
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from typing import Optional, Dict, Any

from models import db, User, GameSave
from config import Config

app = Flask(__name__, static_folder='statics', template_folder='templates')
app.config.from_object(Config)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/user')
def get_user():
    if current_user.is_authenticated:
        return jsonify({
            'loggedIn': True,
            'username': current_user.username
        })
    return jsonify({'loggedIn': False})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('username', 'password')):
        return jsonify({'error': 'Kullanıcı adı ve şifre gerekli!'}), 400
        
    username = data['username'].strip()
    password = data['password']
    
    if len(username) < 3:
        return jsonify({'error': 'Kullanıcı adı en az 3 karakter olmalı!'}), 400
        
    if len(password) < 6:
        return jsonify({'error': 'Şifre en az 6 karakter olmalı!'}), 400
        
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Bu kullanıcı adı zaten kullanılıyor!'}), 400
        
    user = User(
        username=username,
        password_hash=generate_password_hash(password)
    )
    
    db.session.add(user)
    db.session.commit()
    
    login_user(user)
    return jsonify({'message': 'Kayıt başarılı! Oyuna yönlendiriliyorsunuz...'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not all(k in data for k in ('username', 'password')):
        return jsonify({'error': 'Kullanıcı adı ve şifre gerekli!'}), 400
        
    user = User.query.filter_by(username=data['username'].strip()).first()
    
    if user is None or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Geçersiz kullanıcı adı veya şifre!'}), 401
        
    login_user(user)
    return jsonify({'message': 'Giriş başarılı! Oyuna yönlendiriliyorsunuz...'})

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Çıkış yapıldı!'})

# Initialize extensions
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Create database tables
with app.app_context():
    db.create_all()

@login_manager.user_loader
def load_user(user_id: str) -> Optional[User]:
    return User.query.get(int(user_id))



@app.route('/api/save', methods=['POST'])
@login_required
def save_game():
    data = request.get_json()
    
    if not data or 'save_name' not in data or 'game_state' not in data:
        return jsonify({'error': 'Missing required fields'}), 400
        
    save = GameSave.query.filter_by(
        user_id=current_user.id,
        save_name=data['save_name']
    ).first()
    
    if save:
        save.set_game_state(data['game_state'])
    else:
        save = GameSave(
            user_id=current_user.id,
            save_name=data['save_name'],
            data='{}'
        )
        save.set_game_state(data['game_state'])
        db.session.add(save)
    
    db.session.commit()
    return jsonify({'message': 'Game saved successfully'})

@app.route('/api/load/<save_name>')
@login_required
def load_game(save_name: str):
    save = GameSave.query.filter_by(
        user_id=current_user.id,
        save_name=save_name
    ).first()
    
    if not save:
        return jsonify({'error': 'Save not found'}), 404
        
    return jsonify(save.get_game_state())

@app.route('/api/saves')
@login_required
def list_saves():
    saves = GameSave.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {
            'save_name': save.save_name,
            'created_at': save.created_at.isoformat(),
            'updated_at': save.updated_at.isoformat()
        }
        for save in saves
    ])

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500
