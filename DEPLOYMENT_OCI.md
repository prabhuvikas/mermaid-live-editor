# Deploy Mermaid Live Editor on Oracle Cloud (OCI) Free Tier - Forever Free Hosting

This guide will help you deploy the Mermaid Live Editor on Oracle Cloud Infrastructure (OCI) Free Tier compute instances, which are **free forever** and provide excellent performance.

## 🌟 Why OCI Free Tier?

- **Forever Free**: No time limits, truly free forever
- **Generous Resources**: 2 AMD-based Compute VMs with 1GB RAM each OR 1 Ampere A1 Compute VM with 4 cores and 24GB RAM
- **Always-on**: 24/7 uptime
- **100% Free**: No credit card charges after trial
- **Fast**: Excellent network performance
- **Global**: Multiple regions available

---

## 📋 Prerequisites

- Oracle Cloud account (sign up at https://www.oracle.com/cloud/free/)
- Basic command line knowledge
- SSH client installed on your local machine

---

## 🚀 Step-by-Step Deployment Guide

### Part 1: Create OCI Free Tier Compute Instance

#### 1.1 Sign Up for Oracle Cloud

1. Go to https://www.oracle.com/cloud/free/
2. Click "Start for free"
3. Complete the registration (requires credit card for verification, but won't be charged)
4. Verify your email and log in to OCI Console

#### 1.2 Create a Compute Instance

1. **Navigate to Compute**
   - In OCI Console, click the hamburger menu (☰)
   - Go to **Compute** → **Instances**
   - Click **Create Instance**

2. **Configure Instance**
   ```
   Name: mermaid-live-editor
   Compartment: (root) or create a new one

   Placement:
   - Availability Domain: (select any)

   Image and Shape:
   - Image: Ubuntu 22.04 (recommended)
   - Shape: VM.Standard.E2.1.Micro (Always Free) OR
            VM.Standard.A1.Flex (4 OCPUs, 24GB RAM - Better!)

   Networking:
   - Create a new VCN: Yes
   - Subnet: Create new public subnet
   - Assign a public IPv4 address: Yes

   SSH Keys:
   - Generate a key pair: Download both private and public keys
   - OR upload your existing public key
   ```

3. **Click "Create"**
   - Wait 1-2 minutes for instance to provision
   - Note down the **Public IP Address**

#### 1.3 Configure Security Rules

1. Click on the instance name
2. Click on the subnet link (e.g., "subnet-...")
3. Click on the default security list
4. Click **Add Ingress Rules**

**Add these rules:**

```
Rule 1: HTTP
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port Range: 80
- Description: HTTP traffic

Rule 2: HTTPS (optional, for later)
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port Range: 443
- Description: HTTPS traffic

Rule 3: Custom Port (if not using nginx)
- Source CIDR: 0.0.0.0/0
- IP Protocol: TCP
- Destination Port Range: 3000
- Description: Node.js app
```

---

### Part 2: Connect to Your Instance

#### 2.1 SSH Connection

**On Linux/Mac:**
```bash
chmod 400 ~/Downloads/ssh-key-*.key
ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

**On Windows (PowerShell):**
```powershell
ssh -i C:\Users\YourName\Downloads\ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

---

### Part 3: Server Setup

#### 3.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### 3.2 Install Node.js 18+ (Using NodeSource)

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

#### 3.3 Install Git

```bash
sudo apt install -y git
```

#### 3.4 Install Nginx (Web Server)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 3.5 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

---

### Part 4: Deploy Application

#### 4.1 Clone Repository

```bash
cd ~
git clone https://github.com/prabhuvikas/mermaid-live-editor.git
cd mermaid-live-editor
```

If using the feature branch:
```bash
git checkout claude/plan-mermaid-app-features-011CUtTBzLJd4kRFSaoTxzwB
```

#### 4.2 Install Dependencies

```bash
npm install
```

#### 4.3 Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

---

### Part 5: Configure Nginx

#### 5.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/mermaid-editor
```

**Paste this configuration:**

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name YOUR_PUBLIC_IP;  # Replace with your IP or domain

    root /home/ubuntu/mermaid-live-editor/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        try_files $uri $uri/ /index.html;
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
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

#### 5.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/mermaid-editor /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

#### 5.3 Configure Ubuntu Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

### Part 6: Set Up Auto-Updates (Optional)

#### 6.1 Create Update Script

```bash
nano ~/update-app.sh
```

**Paste this:**

```bash
#!/bin/bash
cd /home/ubuntu/mermaid-live-editor
git pull origin claude/plan-mermaid-app-features-011CUtTBzLJd4kRFSaoTxzwB
npm install
npm run build
sudo systemctl reload nginx
echo "App updated successfully at $(date)"
```

**Make executable:**
```bash
chmod +x ~/update-app.sh
```

#### 6.2 Set Up Cron for Auto-Updates (Weekly)

```bash
crontab -e
```

**Add this line:**
```
0 2 * * 0 /home/ubuntu/update-app.sh >> /home/ubuntu/update.log 2>&1
```

This updates every Sunday at 2 AM.

---

### Part 7: Access Your App

1. **Open browser**
2. **Go to:** `http://YOUR_PUBLIC_IP`
3. **Your Mermaid Live Editor should be running!**

---

## 🔒 Optional: Add HTTPS with Let's Encrypt (Recommended)

### Prerequisites
- A domain name pointing to your OCI instance IP
- Example: `mermaid.yourdomain.com` → `YOUR_PUBLIC_IP`

### Steps

#### 1. Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 2. Update Nginx Config

```bash
sudo nano /etc/nginx/sites-available/mermaid-editor
```

**Change:**
```nginx
server_name YOUR_PUBLIC_IP;
```

**To:**
```nginx
server_name mermaid.yourdomain.com;
```

#### 3. Obtain SSL Certificate

```bash
sudo certbot --nginx -d mermaid.yourdomain.com
```

Follow the prompts:
- Enter email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

#### 4. Auto-Renewal

```bash
sudo systemctl status certbot.timer  # Should be active
```

Certbot auto-renews certificates. Test with:
```bash
sudo certbot renew --dry-run
```

---

## 🔧 Alternative: Run as Node.js Preview Server

If you prefer running the Vite preview server instead of serving static files:

#### 1. Update Nginx Config

```nginx
server {
    listen 80;
    server_name YOUR_PUBLIC_IP;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 2. Run with PM2

```bash
cd ~/mermaid-live-editor
pm2 start npm --name "mermaid-editor" -- run preview
pm2 save
pm2 startup
```

This keeps the app running even after server restarts.

---

## 📊 Monitoring & Maintenance

### Check App Status

```bash
pm2 status
pm2 logs mermaid-editor
pm2 monit  # Real-time monitoring
```

### Check Nginx Status

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Restart Services

```bash
sudo systemctl restart nginx
pm2 restart mermaid-editor
```

### Update Application

```bash
cd ~/mermaid-live-editor
git pull
npm install
npm run build
sudo systemctl reload nginx
```

---

## 🎯 Performance Optimization

### 1. Enable HTTP/2

In nginx config, change:
```nginx
listen 443 ssl http2;
```

### 2. Add Brotli Compression

```bash
sudo apt install -y nginx-module-brotli
```

Add to nginx config:
```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml;
```

### 3. Increase Client Upload Limit (if needed)

```nginx
client_max_body_size 10M;
```

---

## 💾 Backup Strategy

### Automatic Daily Backups

```bash
nano ~/backup.sh
```

**Paste:**
```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
cd /home/ubuntu/mermaid-live-editor
tar -czf $BACKUP_DIR/mermaid-backup-$DATE.tar.gz dist/ package.json

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs rm -f
```

**Make executable and add to cron:**
```bash
chmod +x ~/backup.sh
crontab -e
```

Add:
```
0 3 * * * /home/ubuntu/backup.sh
```

---

## 🐛 Troubleshooting

### App Not Accessible

1. **Check nginx:**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

2. **Check OCI Security Lists:**
   - Verify port 80/443 ingress rules exist

3. **Check Ubuntu firewall:**
   ```bash
   sudo ufw status
   ```

### Port Already in Use

```bash
sudo lsof -i :80
sudo kill -9 <PID>
```

### Out of Memory

If using VM.Standard.E2.1.Micro (1GB RAM):

```bash
# Create swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Build Fails

```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📈 Scaling Options

### Upgrade to Better Free Tier Instance

OCI offers **VM.Standard.A1.Flex** (Ampere ARM):
- 4 OCPUs (cores)
- 24 GB RAM
- Still **FREE FOREVER**!

To migrate:
1. Create new A1 instance
2. Follow same setup steps
3. Copy files: `scp -r dist/ ubuntu@NEW_IP:~/`

---

## 🌍 Use a Free Domain

Get a free domain for better URLs:

1. **Freenom** (free .tk, .ml, .ga domains)
   - https://www.freenom.com

2. **DuckDNS** (free subdomain)
   - https://www.duckdns.org

3. **No-IP** (free DDNS)
   - https://www.noip.com

---

## 💰 Cost Breakdown

| Resource | Cost |
|----------|------|
| OCI Compute Instance (VM.Standard.E2.1.Micro) | **$0/month** |
| OCI Block Storage (50 GB boot volume) | **$0/month** |
| OCI Bandwidth (10 TB outbound) | **$0/month** |
| Domain (if using Freenom) | **$0/year** |
| SSL Certificate (Let's Encrypt) | **$0/year** |
| **TOTAL** | **$0 - FREE FOREVER!** |

---

## 🎉 Success!

Your Mermaid Live Editor is now:
- ✅ Running on OCI Free Tier
- ✅ Accessible 24/7
- ✅ Completely FREE forever
- ✅ Production-ready
- ✅ Auto-updating (optional)
- ✅ Backed up daily (optional)
- ✅ Secured with HTTPS (optional)

---

## 📚 Additional Resources

- **OCI Free Tier**: https://www.oracle.com/cloud/free/
- **OCI Documentation**: https://docs.oracle.com/en-us/iaas/
- **Nginx Docs**: https://nginx.org/en/docs/
- **PM2 Guide**: https://pm2.keymetrics.io/
- **Let's Encrypt**: https://letsencrypt.org/

---

## 🆘 Support

If you encounter issues:

1. **Check OCI Console**: Look for instance health
2. **Review Logs**: `sudo tail -f /var/log/nginx/error.log`
3. **Test Locally**: `npm run preview` on your instance
4. **OCI Support**: Free tier includes cloud support

---

**Congratulations!** You now have a professional Mermaid diagram editor running for free, forever! 🎊
