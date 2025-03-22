#!/bin/sh

echo "Waiting for database to be ready..."
# Maximum number of attempts
max_attempts=30
# Delay between attempts (in seconds)
delay=2
# Counter for attempts
attempt=1

while [ $attempt -le $max_attempts ]; do
    echo "Attempt $attempt of $max_attempts: Checking database connection..."
    
    # Try to connect to the database
    npx prisma db push --skip-generate
    
    # Check if the command was successful
    if [ $? -eq 0 ]; then
        echo "Database is ready!"
        break
    fi
    
    # Increment the counter
    attempt=$((attempt + 1))
    
    # Wait before the next attempt
    echo "Database not ready yet. Waiting $delay seconds..."
    sleep $delay
done

if [ $attempt -gt $max_attempts ]; then
    echo "Could not connect to the database after $max_attempts attempts. Exiting."
    exit 1
fi

# Run migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec node server.js