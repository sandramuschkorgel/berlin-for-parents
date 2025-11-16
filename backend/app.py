from flask import Flask
from models import Base
from config import DATABASE_URL, SECRET_KEY

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = SECRET_KEY

from sqlalchemy import create_engine

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)

# Import routes after app creation
from routes import playgrounds

app.register_blueprint(playgrounds.bp)
