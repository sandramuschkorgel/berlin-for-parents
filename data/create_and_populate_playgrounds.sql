-- Create custom table 'playgrounds'
CREATE TABLE playgrounds (
  osm_id BIGINT PRIMARY KEY,
  "addr:housename" TEXT,
  "addr:housenumber" TEXT,
  "addr:interpolation" TEXT,
  barrier TEXT,
  boundary TEXT,
  access TEXT,
  tags hstore,
  way geometry(Point, 3857)
);

-- Populate 'playgrounds' table
INSERT INTO playgrounds (
  osm_id,
  "addr:housename",
  "addr:housenumber",
  "addr:interpolation",
  barrier,
  boundary,
  access,
  tags,
  way
)
SELECT
  osm_id,
  "addr:housename",
  "addr:housenumber",
  "addr:interpolation",
  barrier,
  boundary,
  access,
  tags,
  way
FROM planet_osm_point;
