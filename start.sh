#!/bin/sh
set -e

echo "Starting honey-explorer..."

# Convert DATABASE_URL from postgres:// to JDBC format if present
if [ -n "$DATABASE_URL" ]; then
    echo "Parsing DATABASE_URL..."

    # Remove the postgres:// prefix
    URL_WITHOUT_SCHEME=$(echo "$DATABASE_URL" | sed 's|postgres://||')

    # Extract user:pass part (before @)
    USER_PASS=$(echo "$URL_WITHOUT_SCHEME" | cut -d'@' -f1)

    # Extract host:port/dbname part (after @)
    HOST_PORT_DB=$(echo "$URL_WITHOUT_SCHEME" | cut -d'@' -f2)

    # Extract username (before :)
    DB_USER=$(echo "$USER_PASS" | cut -d':' -f1)

    # Extract password (after :)
    DB_PASS=$(echo "$USER_PASS" | cut -d':' -f2)

    # Build JDBC URL without credentials in the path
    JDBC_URL="jdbc:postgresql://${HOST_PORT_DB}"

    # Set Spring datasource properties
    export SPRING_DATASOURCE_URL="$JDBC_URL"
    export SPRING_DATASOURCE_USERNAME="$DB_USER"
    export SPRING_DATASOURCE_PASSWORD="$DB_PASS"

    echo "Configured JDBC URL: $JDBC_URL"
    echo "Configured DB User: $DB_USER"
fi

# Start Java application in background
echo "Starting Java backend on port 8080..."
java -Xmx512m \
     -XX:+UseContainerSupport \
     -XX:MaxRAMPercentage=75.0 \
     -Dspring.profiles.active=prod \
     -jar /app/app.jar &

JAVA_PID=$!
echo "Java backend started with PID $JAVA_PID"

# Wait a moment for backend to start
sleep 10

# Start nginx in foreground
echo "Starting Nginx on port 80..."
exec nginx -g 'daemon off;'
