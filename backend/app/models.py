from sqlalchemy import BigInteger, Text, Column
from sqlalchemy.dialects.postgresql import HSTORE
from geoalchemy2 import Geometry
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Playground(Base):
    __tablename__ = 'playgrounds'

    osm_id = Column(BigInteger, primary_key=True, nullable=False)
    name = Column(Text, nullable=True)
    way = Column(Geometry('POINT', srid=3857), nullable=True)
    access = Column(Text, nullable=True)
    barrier = Column(Text, nullable=True)
    tags = Column(HSTORE, nullable=True)
