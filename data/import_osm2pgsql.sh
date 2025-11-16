#!/bin/bash

# Environment variables
DB_NAME="${DB_NAME:-playgrounds}"
DB_USER="${DB_USER:?DB_USER is not set}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
OSM_FILE="${OSM_FILE:?OSM_FILE path is not set}"

# Run osm2pgsql import
osm2pgsql -d $DB_NAME -U $DB_USER -H $DB_HOST -P $DB_PORT --create --slim --hstore "$OSM_FILE"