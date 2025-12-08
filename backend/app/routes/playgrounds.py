from flask import Blueprint, jsonify, current_app
from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker
from ..models import Playground
from ..config import DATABASE_URL

bp = Blueprint('playgrounds', __name__, url_prefix='/api')

# Setup session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

@bp.route('/playgrounds', methods=['GET'])
def get_playgrounds():
    session = SessionLocal()
    try:
        playgrounds = session.query(Playground).all()
        result = []

        for pg in playgrounds:
            # Transform geometry to lat/lon
            point = session.execute(
                text("SELECT ST_AsText(ST_Transform(way, 4326)) FROM playgrounds WHERE osm_id = :id"),
                {'id': pg.osm_id}
            ).scalar()

            if point:
                _, coords = point.split('(')
                coords = coords.strip(')')
                lon, lat = coords.split()
                
                result.append({
                    "id": pg.osm_id,
                    "name": pg.name,
                    "lat": float(lat),
                    "lon": float(lon)
                })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
