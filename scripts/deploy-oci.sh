#!/bin/bash

# Mermaid Live Editor - OCI Deployment Script
# Run this script on your fresh OCI Ubuntu instance

set -e  # Exit on error

echo "🚀 Starting Mermaid Live Editor Deployment on OCI..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please do not run as root. Run as ubuntu user."
    exit 1
fi

# Step 1: Update system
print_info "Step 1/8: Updating system packages..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Step 2: Install Node.js
print_info "Step 2/8: Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node_version=$(node --version)
print_success "Node.js installed: $node_version"

# Step 3: Install Git
print_info "Step 3/8: Installing Git..."
sudo apt install -y git
print_success "Git installed"

# Step 4: Install Nginx
print_info "Step 4/8: Installing Nginx..."
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
print_success "Nginx installed and started"

# Step 5: Install PM2
print_info "Step 5/8: Installing PM2..."
sudo npm install -g pm2
print_success "PM2 installed"

# Step 6: Clone repository
print_info "Step 6/8: Cloning repository..."
cd ~
if [ -d "mermaid-live-editor" ]; then
    print_info "Repository already exists, pulling latest..."
    cd mermaid-live-editor
    git pull
else
    git clone https://github.com/prabhuvikas/mermaid-live-editor.git
    cd mermaid-live-editor
fi

# Checkout feature branch
git checkout claude/plan-mermaid-app-features-011CUtTBzLJd4kRFSaoTxzwB || print_info "Branch already checked out"
print_success "Repository ready"

# Step 7: Build application
print_info "Step 7/8: Installing dependencies and building..."
npm install
npm run build
print_success "Application built"

# Step 8: Configure Nginx
print_info "Step 8/8: Configuring Nginx..."

# Get public IP
PUBLIC_IP=$(curl -s ifconfig.me)

# Create Nginx config
sudo tee /etc/nginx/sites-available/mermaid-editor > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;

    server_name $PUBLIC_IP;

    root /home/ubuntu/mermaid-live-editor/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/mermaid-editor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
print_success "Nginx configured"

# Configure firewall
print_info "Configuring Ubuntu firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
print_success "Firewall configured"

# Create update script
print_info "Creating update script..."
cat > ~/update-app.sh <<'EOF'
#!/bin/bash
cd /home/ubuntu/mermaid-live-editor
git pull origin claude/plan-mermaid-app-features-011CUtTBzLJd4kRFSaoTxzwB
npm install
npm run build
sudo systemctl reload nginx
echo "App updated successfully at $(date)"
EOF

chmod +x ~/update-app.sh
print_success "Update script created"

# Create backup script
print_info "Creating backup script..."
cat > ~/backup.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd /home/ubuntu/mermaid-live-editor
tar -czf $BACKUP_DIR/mermaid-backup-$DATE.tar.gz dist/ package.json

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs rm -f
EOF

chmod +x ~/backup.sh
print_success "Backup script created"

# Create swap if needed (for 1GB RAM instances)
TOTAL_RAM=$(free -m | awk 'NR==2{print $2}')
if [ "$TOTAL_RAM" -lt 2000 ]; then
    print_info "Creating 2GB swap file (low RAM detected)..."
    if [ ! -f /swapfile ]; then
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        print_success "Swap file created"
    else
        print_info "Swap file already exists"
    fi
fi

# Final summary
echo ""
echo "=================================================="
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "=================================================="
echo ""
echo -e "${YELLOW}Your Mermaid Live Editor is now running at:${NC}"
echo -e "${GREEN}http://$PUBLIC_IP${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Visit http://$PUBLIC_IP in your browser"
echo "2. (Optional) Set up HTTPS with: sudo certbot --nginx"
echo "3. (Optional) Schedule auto-updates: crontab -e"
echo "   Add: 0 2 * * 0 /home/ubuntu/update-app.sh >> /home/ubuntu/update.log 2>&1"
echo ""
echo -e "${YELLOW}Useful commands:${NC}"
echo "- Update app: ~/update-app.sh"
echo "- Backup app: ~/backup.sh"
echo "- View logs: sudo tail -f /var/log/nginx/error.log"
echo "- Restart nginx: sudo systemctl restart nginx"
echo ""
echo -e "${GREEN}Enjoy your free, forever-running Mermaid editor! 🚀${NC}"
