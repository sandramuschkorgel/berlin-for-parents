from flask import Flask, render_template
from models import Base
from config import DATABASE_URL, SECRET_KEY
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

app = Flask(
    __name__,
    template_folder=str(BASE_DIR / "frontend" / "templates"),
    static_folder=str(BASE_DIR / "frontend" / "static"),
    static_url_path="/static" 
)
app.config['SECRET_KEY'] = SECRET_KEY

from sqlalchemy import create_engine

engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)

# Import routes after app creation
from routes import playgrounds

app.register_blueprint(playgrounds.bp)

@app.route('/')
def index():
    return render_template('pg_map.html')

@app.route('/playgrounds_list')
def playgrounds_list():
    return render_template('pg_grid.html', playgrounds=playgrounds.get_playgrounds().json)