from sqlalchemy import BigInteger, Text, Column
from geoalchemy2 import Geometry
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Playground(Base):
    __tablename__ = 'playgrounds'

    osm_id = Column(BigInteger, primary_key=True)
    name = Column(Text, nullable=True)
    way = Column(Geometry('POINT', srid=3857), nullable=False)

    def to_dict(self):
        # Convert the way point to lat/lon (EPSG:4326)
        return {
            "id": self.id,
            "name": self.name,
            "way": self.way
        }
