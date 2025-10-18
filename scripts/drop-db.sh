#!/bin/bash

# Load environment variables
source .env.dev
 
# Drop database
PGPASSWORD=$DB_PASSWORD psql -U $DB_USERNAME -h $DB_HOST -p $DB_PORT -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME" 