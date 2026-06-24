# 🚀 Quick Start Guide - Field-to-Office Sync

Panduan cepat untuk menjalankan aplikasi dalam 5 menit.

---

## ⚡ Instalasi Cepat

### 1. Clone & Install
```bash
# Clone repository
git clone [repository-url]
cd field-to-office-sync

# Install dependencies (pilih salah satu)
pnpm install   # Recommended
# atau
npm install
# atau
yarn install
```

### 2. Jalankan Development Server
```bash
pnpm run dev
# atau
npm run dev
```

Buka browser: **http://localhost:5173**

---

## 🎯 Fitur Utama

### 1️⃣ Scan Dokumen dengan OCR
- Buka **Form Pemeriksaan Jenazah**
- Navigasi ke step **Review**
- Klik **"Scan Dokumen dengan OCR"**
- Izinkan akses kamera
- Arahkan kamera ke dokumen (KTP/KK/NPWP)
- Klik **"Ambil Foto & Scan OCR"**
- Tunggu proses OCR selesai (~5-10 detik)
- Data NIK dan tanggal lahir akan terekstrak otomatis ✨

### 2️⃣ Field Officer Dashboard
- Input data pemeriksaan jenazah
- Multi-step form dengan validasi
- Scan dan upload dokumen pendukung
- Real-time status tracking

### 3️⃣ Admin Dashboard
- Lihat semua pengajuan masuk
- Verifikasi atau reject data
- Filter dan search
- Export data (coming soon)

---

## 📁 Struktur Project

```
src/
├── app/
│   ├── pages/              # Halaman utama
│   │   ├── HomePage.tsx
│   │   ├── DataCollectionForm.tsx  # Form dengan OCR
│   │   ├── FieldOfficerDashboard.tsx
│   │   └── AdminDashboard.tsx
│   ├── context/
│   │   └── DataContext.tsx # State management global
│   ├── components/
│   │   └── ui/             # UI components (Radix UI)
│   └── routes.tsx          # React Router config
└── styles/                 # Tailwind CSS
```

---

## 🔧 Teknologi

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| React | 18.3.1 | UI Framework |
| TypeScript | Latest | Type Safety |
| Vite | 6.3.5 | Build Tool |
| Tailwind CSS | 4.1.12 | Styling |
| Tesseract.js | 7.0.0 | **OCR Engine** |
| React Webcam | 7.2.0 | **Camera Integration** |
| React Router | 7.13.0 | Routing |
| Radix UI | Latest | UI Components |

---

## 🎨 Pages Overview

### 1. Home Page (`/`)
- Landing page dengan penjelasan sistem
- Role selection (Field Officer / Admin)
- Technical architecture overview

### 2. Field Officer Dashboard (`/field-officer`)
- Tombol "Tambah Data Baru"
- List pengajuan yang telah dibuat
- Real-time notifications
- Quick stats

### 3. Data Collection Form (`/form`)
**4 Steps:**
- ✅ **Step 1**: Waktu & Tempat Pemeriksaan
- ✅ **Step 2**: Kelengkapan Dokumen (checklist)
- ✅ **Step 3**: Pemeriksaan Fisik Peti (checklist)
- ✅ **Step 4**: Review & **Scan Dokumen (OCR)** 🔥

### 4. Admin Dashboard (`/admin`)
- View all submissions
- Filter by status (pending/verified/rejected)
- Detail view dengan modal
- Status management
- Document preview with OCR data

---

## 🔍 Cara Menggunakan OCR

### Step-by-step:

1. **Buka Form**
   ```
   Homepage → Field Officer → Tambah Data → Isi form → Review
   ```

2. **Di halaman Review**, scroll ke bawah ke section:
   ```
   "Lampiran Dokumen Pendukung (Opsional)"
   ```

3. **Pilih Jenis Dokumen**
   - KTP
   - Kartu Keluarga (KK)
   - NPWP
   - Dokumen Lainnya

4. **Klik "Scan Dokumen dengan OCR"**
   - Modal kamera akan muncul
   - Browser akan minta izin akses kamera (allow)

5. **Ambil Foto**
   - Arahkan kamera ke dokumen
   - Pastikan pencahayaan baik
   - Dokumen terlihat jelas dan fokus
   - Klik "Ambil Foto & Scan OCR"

6. **Tunggu Proses OCR**
   - Loading spinner muncul
   - Progress di console log
   - Tunggu ~5-10 detik

7. **Lihat Hasil**
   - Toast notification muncul
   - Dokumen tersimpan dengan thumbnail
   - Data OCR ditampilkan (NIK, Nama, Tanggal Lahir)
   - Icon ✨ menandakan data terdeteksi

8. **Scan Lebih Banyak** (opsional)
   - Ulangi untuk dokumen lain
   - Semua dokumen tersimpan dalam array

9. **Submit Form**
   - Klik "Kirim Laporan"
   - Semua dokumen + OCR data tersimpan

---

## 🐛 Troubleshooting OCR

### ❌ Kamera tidak muncul
**Solusi:**
- Pastikan browser memiliki izin kamera
- Cek Settings > Privacy > Camera
- Coba browser lain (Chrome recommended)
- Pastikan kamera tidak digunakan aplikasi lain

### ❌ OCR lambat
**Solusi:**
- Tunggu beberapa detik (normal 5-10 detik)
- OCR pertama kali akan download language data (~10MB)
- Data tersimpan di browser cache untuk penggunaan berikutnya
- Cek koneksi internet

### ❌ OCR tidak mendeteksi data
**Solusi:**
- Gunakan pencahayaan yang baik
- Pastikan dokumen tidak blur
- Hindari refleksi cahaya
- Foto dokumen secara frontal (tidak miring)
- Gunakan resolusi kamera yang baik

### ❌ NIK tidak terdeteksi
**Solusi:**
OCR mencari pattern 16 digit angka:
- Pastikan NIK terlihat jelas di foto
- Tidak ada shadow atau blur di area NIK
- Coba foto ulang dengan fokus pada area NIK

### ❌ Build error
**Solusi:**
```bash
# Clear cache
rm -rf node_modules dist
rm pnpm-lock.yaml

# Reinstall
pnpm install

# Build
pnpm run build
```

---

## 📱 Testing di Mobile

### Via Network
```bash
# Jalankan dev server
pnpm run dev

# Cek IP address komputer
# Windows: ipconfig
# Mac/Linux: ifconfig

# Akses dari HP di network yang sama:
http://[YOUR-IP]:5173
```

### Via Ngrok (HTTPS)
```bash
# Install ngrok
npm install -g ngrok

# Jalankan aplikasi
pnpm run dev

# Di terminal baru
ngrok http 5173

# Gunakan HTTPS URL dari ngrok di mobile browser
```

---

## 🚀 Build & Deploy

### Build Production
```bash
pnpm run build
```

Output: `dist/` folder

### Deploy ke Netlify
```bash
# Install CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy ke Vercel
```bash
# Install CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## 📚 Dokumentasi Lengkap

Untuk informasi lebih detail, lihat:

- **[INSTALASI.md](./INSTALASI.md)** - Panduan instalasi lengkap
- **[BACKEND_LOGIC.md](./BACKEND_LOGIC.md)** - Dokumentasi arsitektur & backend

---

## 🔑 Key Features Summary

✅ **OCR Aktif** - Tesseract.js dengan bahasa Indonesia  
✅ **Ekstraksi Data Otomatis** - NIK, Nama, Tanggal Lahir  
✅ **Webcam Integration** - Real-time camera preview  
✅ **Multi-step Form** - User-friendly wizard  
✅ **Real-time Notifications** - Instant feedback  
✅ **Responsive Design** - Mobile & desktop  
✅ **localStorage Persistence** - Data saved locally  
✅ **Role-based Access** - Field Officer & Admin views  

---

## 📞 Support

Issues atau pertanyaan? 
- Check **console log** untuk error details
- Review **[INSTALASI.md](./INSTALASI.md)** troubleshooting section
- Check browser compatibility

---

## ⚡ Quick Commands

```bash
# Development
pnpm run dev

# Build
pnpm run build

# Preview build
pnpm run preview

# Install package
pnpm add package-name

# Update dependencies
pnpm update
```

---

**Happy Coding! 🚀**

Version: 1.0.0 | Updated: Maret 2026
