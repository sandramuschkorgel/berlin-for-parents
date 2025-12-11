from flask import Blueprint, jsonify
from sqlalchemy import func, text, create_engine
from sqlalchemy.orm import sessionmaker
from ..models import Playground
from ..config import DATABASE_URL

bp = Blueprint('playgrounds', __name__, url_prefix='/api')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def transform_access(access_value):
    if access_value == "yes":
        return "public"
    elif access_value in ["private", "permissive"]:
        return "private"
    elif access_value in ["customers", "permit"]:
        return "commercial"
    elif access_value == "no":
        return None
    else:
        return "unknown"

def transform_barrier(barrier_value):
    if barrier_value is None:
        return "unknown", None
    else:
        return "yes", barrier_value
    
def extract_useful_tags(tags_hstore):
    if not tags_hstore:
        return {}
    
    useful_keys = [
        'wheelchair',
        'opening_hours',
        'indoor',
        'dog',
        'min_age',
        'description',
        'material'
    ]
    
    result = {}
    for key in useful_keys:
        if key in tags_hstore:
            result[key] = tags_hstore[key]
    
    return result if result else None

@bp.route('/playgrounds', methods=['GET'])
def get_playgrounds():
    session = SessionLocal()
    try:
        playgrounds = session.query(
            Playground.osm_id,
            Playground.name,
            Playground.access,
            Playground.barrier,
            # Convert POINT to lat/lon (EPSG:4326)
            func.ST_Y(func.ST_Transform(Playground.way, 4326)).label('lat'),
            func.ST_X(func.ST_Transform(Playground.way, 4326)).label('lon'),
            Playground.tags
        ).all()

        result = []

        for pg in playgrounds:
            category = transform_access(pg.access)
            if category is None:
                continue # Skip playgrounds that are inaccessible

            barrier_status, barrier_type = transform_barrier(pg.barrier)
            tags = extract_useful_tags(pg.tags)

            result.append({
                "id": pg.osm_id, # Return as id in API
                "name": pg.name,
                "lat": float(pg.lat) if pg.lat else None,
                "lon": float(pg.lon) if pg.lon else None,
                "category": category,
                "barrier": barrier_status,
                "barrier_type": barrier_type,
                "tags": tags
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        session.close()
