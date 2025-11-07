# Mermaid Live Editor - Quick Start Guide

## 🚀 Deploy to OCI Free Tier in 5 Minutes

### Step 1: Create OCI Account
1. Visit https://www.oracle.com/cloud/free/
2. Sign up (free, requires credit card for verification but won't charge)
3. Log in to OCI Console

### Step 2: Create Compute Instance
1. **Navigate:** Compute → Instances → Create Instance
2. **Name:** `mermaid-editor`
3. **Image:** Ubuntu 22.04
4. **Shape:** VM.Standard.A1.Flex (4 cores, 24GB RAM - FREE!)
   - Alternative: VM.Standard.E2.1.Micro (1 core, 1GB RAM - also FREE!)
5. **Download SSH keys** when prompted
6. Click **Create**
7. **Copy the Public IP Address**

### Step 3: Configure Firewall
1. Click on your instance → Click subnet → Click security list
2. **Add Ingress Rule:**
   - Source: `0.0.0.0/0`
   - Port: `80`
   - Protocol: TCP

### Step 4: Connect via SSH
```bash
ssh -i ~/Downloads/ssh-key-*.key ubuntu@YOUR_PUBLIC_IP
```

### Step 5: Run Deployment Script
```bash
curl -fsSL https://raw.githubusercontent.com/prabhuvikas/mermaid-live-editor/claude/plan-mermaid-app-features-011CUtTBzLJd4kRFSaoTxzwB/scripts/deploy-oci.sh | bash
```

**Wait 3-5 minutes for installation to complete.**

### Step 6: Access Your App
Open browser: `http://YOUR_PUBLIC_IP`

**🎉 Done! Your Mermaid editor is live!**

---

## 📋 Essential Commands

### Update Application
```bash
~/update-app.sh
```

### Backup Application
```bash
~/backup.sh
```

### View Logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Restart Services
```bash
sudo systemctl restart nginx
```

### Check Status
```bash
sudo systemctl status nginx
```

---

## 🔒 Add HTTPS (Optional but Recommended)

### Requirements
- A domain name pointing to your OCI IP

### Steps
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is automatic!
```

---

## 💡 Tips

### Free Domain Options
- **Freenom:** Free .tk, .ml, .ga domains
- **DuckDNS:** Free subdomain (yourdomain.duckdns.org)
- **No-IP:** Free dynamic DNS

### Performance
- Use **VM.Standard.A1.Flex** for best performance (still free!)
- 4 cores and 24GB RAM handles thousands of users

### Auto-Updates
```bash
crontab -e
```

Add this line:
```
0 2 * * 0 /home/ubuntu/update-app.sh >> /home/ubuntu/update.log 2>&1
```

Updates every Sunday at 2 AM.

---

## 🆘 Troubleshooting

### Can't access app
1. **Check OCI security list** has port 80 open
2. **Check Ubuntu firewall:** `sudo ufw status`
3. **Check nginx:** `sudo systemctl status nginx`

### Out of memory
```bash
# Create 2GB swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Build fails
```bash
cd ~/mermaid-live-editor
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📊 What You Get

### Features
✅ Multi-tab diagram editing
✅ 11+ diagram templates
✅ Export to PNG/SVG/PDF
✅ Presentation mode
✅ Dark/light themes
✅ Offline PWA support
✅ Keyboard shortcuts
✅ Auto-save

### Infrastructure
✅ **FREE forever** - No costs
✅ **24/7 uptime** - Always available
✅ **Fast** - Enterprise SSD storage
✅ **Secure** - HTTPS with Let's Encrypt
✅ **Global** - Choose your region

---

## 📚 More Information

- **Full Deployment Guide:** [DEPLOYMENT_OCI.md](./DEPLOYMENT_OCI.md)
- **Feature Documentation:** [README.md](./README.md)
- **Development Roadmap:** [Plan.md](./Plan.md)

---

## 💰 Total Cost

```
OCI Compute Instance:     $0/month
OCI Storage (50GB):       $0/month
OCI Bandwidth (10TB):     $0/month
Domain (Freenom):         $0/year
SSL Certificate:          $0/year
─────────────────────────────────
TOTAL:                    $0 FOREVER!
```

---

**That's it! You now have a professional diagram editor running 24/7 for FREE!** 🚀
