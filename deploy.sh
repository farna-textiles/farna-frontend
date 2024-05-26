#!/bin/bash

# Define variables
APP_NAME="farna-frontend"
REMOTE_USER="ubuntu"
REMOTE_DIR="farna-frontend"
PM2_PROCESS_NAME="farna-frontend"


# Prompt user for SSH key path
SSH_KEY="./farna-textiles-ec2.pem"

# # Prompt user for remote host
REMOTE_HOST="18.212.106.119"

# Step 1: Remove existing build
echo "Removing existing build..."
rm -rf "./dist"

# Step 2: Create a new build
echo "Creating a new build..."
npm run build

# Step 3: Copy build files to the EC2 instance
echo "Copying build files to the EC2 instance..."
scp -i "$SSH_KEY" -r "./dist" "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# Step 4: SSH into the EC2 instance and serve the app using PM2
echo "Serving the app using PM2 on the EC2 instance..."
ssh -i "$SSH_KEY" "$REMOTE_USER@$REMOTE_HOST" << EOF
  cd "$REMOTE_DIR"
  pm2 stop "$PM2_PROCESS_NAME" || true
  pm2 delete "$PM2_PROCESS_NAME" || true
  pm2 serve  "./dist/" 8080 --spa --name "$PM2_PROCESS_NAME"
  pm2 save
EOF

echo "Deployment complete!"
