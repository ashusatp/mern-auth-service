#!/bin/bash

# Load environment variables
source .env.dev
 
# Create database
PGPASSWORD=$DB_PASSWORD psql -U $DB_USERNAME -h $DB_HOST -p $DB_PORT -d postgres -c "CREATE DATABASE $DB_NAME" 