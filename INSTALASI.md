# 📦 Panduan Instalasi - Field-to-Office Sync

## 📋 Daftar Isi
1. [Persyaratan Sistem](#persyaratan-sistem)
2. [Instalasi Development](#instalasi-development)
3. [Konfigurasi](#konfigurasi)
4. [Menjalankan Aplikasi](#menjalankan-aplikasi)
5. [Build untuk Production](#build-untuk-production)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Persyaratan Sistem

### Minimum Requirements
- **Node.js**: v18.x atau lebih tinggi
- **pnpm**: v8.x atau lebih tinggi (atau npm/yarn)
- **Browser Modern**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **RAM**: Minimum 4GB (8GB direkomendasikan)
- **Storage**: Minimum 500MB ruang kosong

### Fitur Webcam & OCR
- **Kamera**: Webcam internal atau eksternal untuk fitur scan dokumen
- **Koneksi Internet**: Diperlukan untuk pertama kali download OCR language data
- **HTTPS**: Webcam API memerlukan HTTPS di production (kecuali localhost)

---

## 🚀 Instalasi Development

### 1. Clone Repository
```bash
# Jika menggunakan Git
git clone [repository-url]
cd field-to-office-sync
```

### 2. Install Dependencies

#### Menggunakan pnpm (Recommended)
```bash
pnpm install
```

#### Menggunakan npm
```bash
npm install
```

#### Menggunakan yarn
```bash
yarn install
```

### 3. Verifikasi Instalasi
Pastikan semua package terinstall dengan benar:
```bash
pnpm list
```

---

## ⚙️ Konfigurasi

### Environment Variables (Opsional)
Buat file `.env` di root project untuk konfigurasi tambahan:

```env
# Development Server
VITE_PORT=3000

# API Endpoints (jika ada backend terpisah)
VITE_API_URL=http://localhost:5000

# Supabase Configuration (jika menggunakan Supabase)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OCR Settings
VITE_OCR_LANGUAGE=ind
```

### Konfigurasi Browser Permissions
Untuk fitur kamera dan OCR, pastikan browser memiliki izin:
- ✅ Camera Access
- ✅ Local Storage Access
- ✅ JavaScript Enabled

---

## 🏃 Menjalankan Aplikasi

### Development Mode
```bash
pnpm run dev
# atau
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di:
- **URL**: http://localhost:5173
- **Network URL**: http://[your-ip]:5173

### Preview Build
Untuk test production build secara lokal:
```bash
pnpm run build
pnpm run preview
```

---

## 📦 Build untuk Production

### 1. Build Aplikasi
```bash
pnpm run build
```

Output akan tersimpan di folder `/dist`

### 2. Optimasi Build
Build sudah termasuk optimasi:
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Minification
- ✅ Asset optimization
- ✅ Source maps (development only)

### 3. Verifikasi Build
```bash
# Check ukuran bundle
du -sh dist/

# Test build secara lokal
pnpm run preview
```

---

## 🌐 Deployment

### Deployment ke Netlify

#### Via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

#### Via Netlify Website
1. Push code ke GitHub/GitLab
2. Login ke [Netlify](https://netlify.com)
3. New site from Git
4. Pilih repository
5. Build settings:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
6. Deploy site

### Deployment ke Vercel

#### Via Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Via Vercel Website
1. Push code ke GitHub
2. Login ke [Vercel](https://vercel.com)
3. Import project
4. Build settings akan terdeteksi otomatis
5. Deploy

### Deployment ke Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Build
pnpm run build

# Deploy
firebase deploy --only hosting
```

### Deployment ke VPS/Server Custom

```bash
# 1. Build aplikasi
pnpm run build

# 2. Upload folder dist ke server (via SCP/FTP)
scp -r dist/* user@server:/var/www/html/

# 3. Setup Nginx (contoh config)
# /etc/nginx/sites-available/field-to-office-sync

server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html;
    index index.html;

    # Enable HTTPS untuk Webcam API
    # Gunakan Let's Encrypt untuk SSL certificate

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# 4. Restart Nginx
sudo systemctl restart nginx
```

---

## 🔒 Konfigurasi HTTPS (Penting untuk Webcam)

### Menggunakan Let's Encrypt (Certbot)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate SSL Certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Menggunakan Cloudflare
1. Tambahkan domain ke Cloudflare
2. Update nameservers
3. Enable SSL/TLS (Full/Strict)
4. Enable "Always Use HTTPS"

---

## 🐛 Troubleshooting

### Issue: Kamera tidak berfungsi

**Solusi:**
1. Pastikan menggunakan HTTPS di production
2. Check browser permissions
3. Test di browser lain
4. Restart browser/device

```javascript
// Debug: Check camera availability
navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    console.log('Available devices:', devices);
  });
```

### Issue: OCR lambat atau error

**Solusi:**
1. Pastikan koneksi internet stabil untuk download language data
2. Check browser console untuk error details
3. Gunakan gambar dengan pencahayaan baik
4. Reduce image quality jika perlu

```javascript
// Optimize image before OCR
const imageSrc = webcamRef.current.getScreenshot({
  width: 1280, // Reduce from full resolution
  height: 720
});
```

### Issue: Build gagal

**Solusi:**
```bash
# Clear cache dan reinstall
rm -rf node_modules
rm -rf dist
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Build ulang
pnpm run build
```

### Issue: Port sudah digunakan

**Solusi:**
```bash
# Kill process di port 5173
lsof -ti:5173 | xargs kill -9

# Atau gunakan port lain
VITE_PORT=3000 pnpm run dev
```

### Issue: Out of memory saat build

**Solusi:**
```bash
# Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" pnpm run build
```

---

## 📱 Testing di Device Mobile

### Via Ngrok (Expose localhost)
```bash
# Install ngrok
npm install -g ngrok

# Jalankan aplikasi
pnpm run dev

# Di terminal baru, expose port
ngrok http 5173
```

### Via Local Network
```bash
# Jalankan dev server
pnpm run dev

# Akses dari device mobile di network yang sama
# URL: http://[your-computer-ip]:5173
```

---

## 📊 Performance Monitoring

### Bundle Analysis
```bash
# Install analyzer
pnpm add -D rollup-plugin-visualizer

# Build dengan analysis
pnpm run build

# Lihat stats.html
```

### Lighthouse Audit
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5173 --view
```

---

## 🔄 Update & Maintenance

### Update Dependencies
```bash
# Check outdated packages
pnpm outdated

# Update all
pnpm update

# Update specific package
pnpm update package-name
```

### Security Audit
```bash
# Check vulnerabilities
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

---

## 📝 Catatan Penting

1. **OCR Language Data**: Pertama kali OCR berjalan, akan download language data (~10MB). Ini hanya sekali dan tersimpan di browser cache.

2. **Browser Compatibility**: Webcam API tidak support di semua browser. Test di:
   - ✅ Chrome/Edge (Recommended)
   - ✅ Firefox
   - ⚠️ Safari (requires user permission)
   - ❌ IE (not supported)

3. **Mobile Device**: 
   - Fitur kamera otomatis gunakan rear camera
   - Orientasi landscape direkomendasikan untuk scan dokumen
   - Pastikan adequate lighting untuk hasil OCR terbaik

4. **Production HTTPS**: 
   - Webcam API **WAJIB** HTTPS di production
   - Gunakan Cloudflare/Let's Encrypt untuk free SSL

---

## 📞 Support

Jika mengalami masalah:
1. Check browser console untuk error messages
2. Review dokumentasi ini
3. Check GitHub Issues
4. Contact tim development

---

## 📄 License

[Your License Here]

---

**Versi**: 1.0.0  
**Terakhir diupdate**: Maret 2026
