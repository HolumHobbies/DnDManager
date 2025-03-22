#!/bin/bash

# Create Docker network if it doesn't exist
if ! docker network inspect app_network &>/dev/null; then
    echo "Creating app_network Docker network..."
    docker network create app_network
else
    echo "app_network Docker network already exists."
fi

# Build and start the containers
echo "Building and starting containers..."
docker-compose up -d

echo "Setup complete!"
echo "Next.js App: http://localhost:51478"
echo "Storybook: http://localhost:56142"
echo ""
echo "To view logs, run: docker-compose logs -f"
echo "To stop the application, run: docker-compose down"