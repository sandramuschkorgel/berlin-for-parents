from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine
from pathlib import Path

def create_app():
    app = Flask(__name__)
    
    # Import config
    from .config import DATABASE_URL, SECRET_KEY, CORS_ORIGINS
    
    app.config['SECRET_KEY'] = SECRET_KEY
    app.config['DATABASE_URL'] = DATABASE_URL
    
    # Enable CORS for frontend
    CORS(app, origins=CORS_ORIGINS)
    
    # Initialize database
    from .models import Base
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
    
    # Register blueprints
    from .routes import playgrounds
    app.register_blueprint(playgrounds.bp)
    
    # Health check endpoint for Render
    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200
    
    # Root endpoint
    @app.route('/')
    def root():
        return {
            'message': 'Berlin for Parents API',
            'version': '1.0',
            'endpoints': {
                'playgrounds': '/api/playgrounds'
            }
        }, 200
    
    return app
