#!/bin/bash

# Define variables
APP_NAME="farna-frontend"
REMOTE_USER="ubuntu"
REMOTE_DIR="farna-frontend"
PM2_PROCESS_NAME="farna-frontend"


# Prompt user for SSH key path
read -p "Enter the path to your SSH key: " SSH_KEY

# # Prompt user for remote host
read -p "Enter the remote host (e.g., your-ec2-instance-ip): " REMOTE_HOST

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
