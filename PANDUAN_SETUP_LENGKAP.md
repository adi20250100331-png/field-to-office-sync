# 🚀 PANDUAN SETUP LENGKAP - FIELD-TO-OFFICE SYNC

## 📋 DAFTAR ISI
1. [Setup Google Sheets & Apps Script](#1-setup-google-sheets--apps-script)
2. [Konfigurasi Apps Script](#2-konfigurasi-apps-script)
3. [Deploy Web App](#3-deploy-web-app)
4. [Integrasi dengan Frontend](#4-integrasi-dengan-frontend)
5. [Testing Koneksi](#5-testing-koneksi)
6. [Troubleshooting](#6-troubleshooting)

---

## 1️⃣ SETUP GOOGLE SHEETS & APPS SCRIPT

### A. Buat Google Sheet Baru

1. **Buka Google Sheets**
   - Pergi ke: https://sheets.google.com
   - Klik **"Blank"** untuk sheet baru
   - Beri nama: **"Field-to-Office DB"**

2. **Dapatkan Spreadsheet ID**
   - Lihat URL di browser: `https://docs.google.com/spreadsheets/d/1h__uXbr0lFiTRxkDbKVSwN-e8JhEtlAzLpwZqmyMdEA/edit`
   - Copy bagian setelah `/d/` sampai sebelum `/edit`
   - Contoh: `1h__uXbr0lFiTRxkDbKVSwN-e8JhEtlAzLpwZqmyMdEA`
   - **SIMPAN ID INI** - akan digunakan nanti

### B. Buat Google Drive Folder untuk Dokumen

1. **Buka Google Drive**
   - Pergi ke: https://drive.google.com
   - Klik **"New"** → **"Folder"**
   - Beri nama: **"Field-to-Office Documents"**

2. **Dapatkan Folder ID**
   - Buka folder yang baru dibuat
   - Lihat URL: `https://drive.google.com/drive/folders/1ABC123xyz456...`
   - Copy bagian setelah `/folders/`
   - **SIMPAN ID INI** - akan digunakan nanti

### C. Buka Apps Script Editor

1. Di Google Sheet yang sudah dibuat, klik:
   - **Extensions** → **Apps Script**
2. Akan terbuka tab baru dengan Apps Script Editor
3. Hapus semua kode default yang ada (`function myFunction() {...}`)

---

## 2️⃣ KONFIGURASI APPS SCRIPT

### A. Copy Kode Backend

1. **Buka file `/google-apps-script-backend.js`** di repository Anda
2. **Copy SEMUA kode** dari file tersebut
3. **Paste** di Apps Script Editor (gantikan semua kode yang ada)

### B. Update Konfigurasi

Cari bagian **CONFIGURATION** di baris 21-43 dan update:

```javascript
// GANTI dengan Spreadsheet ID Anda
const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_ANDA_DISINI';

// GANTI dengan Drive Folder ID Anda
const DRIVE_FOLDER_ID = 'PASTE_FOLDER_ID_ANDA_DISINI';

// GANTI dengan API Key Anda (buat password yang kuat)
const API_KEY = 'your-secret-api-key-12345-GANTI-INI';
```

**Contoh setelah diisi:**
```javascript
const SPREADSHEET_ID = '1h__uXbr0lFiTRxkDbKVSwN-e8JhEtlAzLpwZqmyMdEA';
const DRIVE_FOLDER_ID = '1xYz789AbC456DeF123GhI789';
const API_KEY = 'kemenkes-kupang-2026-secure-key-abc123';
```

### C. Setup Database (Jalankan Sekali)

1. **Save script** (Ctrl+S atau Cmd+S)
2. Di Apps Script Editor:
   - Pilih function: **`setupDatabase`** dari dropdown
   - Klik tombol **Run** (▶️)
3. **Authorize aplikasi:**
   - Klik **"Review permissions"**
   - Pilih akun Google Anda
   - Klik **"Advanced"** → **"Go to Field-to-Office Sync (unsafe)"**
   - Klik **"Allow"**
4. **Tunggu proses selesai** (lihat "Execution log")
5. **Cek Google Sheet** - seharusnya ada 5 sheet baru:
   - ServiceUsers
   - Documents
   - Notifications
   - Users
   - ActivityLogs

### D. Verifikasi User Admin Dibuat

1. **Buka sheet "Users"** di Google Sheet
2. Pastikan ada 1 baris data dengan:
   - email: `admin@test.com`
   - password: `admin123`
   - role: `admin`

---

## 3️⃣ DEPLOY WEB APP

### A. Deploy sebagai Web App

1. Di Apps Script Editor, klik tombol **"Deploy"** → **"New deployment"**

2. **Konfigurasi deployment:**
   - **Type:** Pilih **"Web app"**
   - **Description:** "Field-to-Office Sync API v1"
   - **Execute as:** Pilih **"Me"** (email Anda)
   - **Who has access:** Pilih **"Anyone"** 
     ⚠️ PENTING: Pilih "Anyone" agar bisa diakses dari frontend

3. Klik **"Deploy"**

4. **Copy Web App URL:**
   - Setelah deploy, akan muncul URL seperti:
   ```
   https://script.google.com/macros/s/AKfycbxxx.../exec
   ```
   - **COPY & SIMPAN URL INI** - akan digunakan di frontend

5. Klik **"Done"**

### B. Test Deployment

1. **Buka URL Web App** di browser baru
2. Tambahkan parameter test:
   ```
   https://script.google.com/macros/s/AKfycbxxx.../exec?action=getServiceUsers&apiKey=your-secret-api-key-12345-GANTI-INI
   ```
   (Ganti `your-secret-api-key-12345-GANTI-INI` dengan API_KEY yang Anda set)

3. **Jika berhasil**, akan muncul response JSON:
   ```json
   {
     "success": true,
     "data": [],
     "timestamp": "2026-03-05T..."
   }
   ```

---

## 4️⃣ INTEGRASI DENGAN FRONTEND

### A. Update Frontend Configuration

1. **Buka file `/src/lib/google-sheets.service.ts`**

2. **Cari dan update konstanta berikut:**

```typescript
// Update dengan URL deployment Anda
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxx.../exec';

// Update dengan API Key yang sama dengan di Apps Script
const API_KEY = 'kemenkes-kupang-2026-secure-key-abc123';
```

3. **Save file**

### B. Update Environment Variables (Opsional tapi Recommended)

1. **Buat file `.env.local`** di root project:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbxxx.../exec
VITE_GOOGLE_APPS_SCRIPT_API_KEY=kemenkes-kupang-2026-secure-key-abc123
```

2. **Update `src/lib/google-sheets.service.ts`** untuk menggunakan environment variables:

```typescript
const APPS_SCRIPT_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbxxx.../exec';
const API_KEY = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_API_KEY || 'your-api-key';
```

---

## 5️⃣ TESTING KONEKSI

### A. Jalankan Aplikasi

```bash
# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

### B. Test Login Admin

1. **Buka browser:** http://localhost:5173
2. **Klik "Login Admin"**
3. **Masukkan kredensial default:**
   - Email: `admin@test.com`
   - Password: `admin123`
4. **Klik "Masuk"**

### C. Test Input Data Petugas

1. **Login sebagai Petugas** (gunakan kredensial demo)
2. **Isi form Data Collection**
3. **Upload dokumen**
4. **Submit form**

### D. Verifikasi di Google Sheets

1. **Buka Google Sheet "Field-to-Office DB"**
2. **Cek sheet "ServiceUsers"** - data baru harus muncul
3. **Cek sheet "Documents"** - link dokumen harus ada
4. **Cek Google Drive folder** - file gambar harus ter-upload

### E. Test Verifikasi Admin

1. **Login sebagai Admin**
2. **Lihat data yang masuk** dari petugas
3. **Klik pada data untuk review**
4. **Ubah status** (Terverifikasi/Tidak Lengkap/Ditolak)
5. **Cek Google Sheet** - status harus terupdate

---

## 6️⃣ TROUBLESHOOTING

### ❌ Error: "Unauthorized: Invalid API key"

**Solusi:**
- Pastikan API_KEY di Apps Script sama dengan di frontend
- Periksa typo dalam API key

### ❌ Error: "Script function not found"

**Solusi:**
- Pastikan Anda sudah deploy Apps Script sebagai Web App
- Redeploy jika perlu: Deploy → Manage deployments → Edit → Deploy

### ❌ Data tidak tersimpan di Google Sheets

**Solusi:**
- Cek browser console untuk error
- Pastikan CORS tidak block request
- Verifikasi SPREADSHEET_ID benar
- Jalankan ulang `setupDatabase()` di Apps Script

### ❌ Upload dokumen gagal

**Solusi:**
- Pastikan DRIVE_FOLDER_ID benar
- Cek permission folder Google Drive
- Pastikan format gambar valid (JPEG/PNG)

### ❌ Error CORS di browser

**Solusi:**
- Pastikan deployment Web App set ke "Anyone"
- Clear browser cache
- Test di incognito/private window

### ❌ Notifikasi tidak muncul

**Solusi:**
- Cek sheet "Notifications" di Google Sheets
- Pastikan userId field terisi dengan benar
- Refresh aplikasi

---

## 📊 STRUKTUR DATABASE

### Sheet: ServiceUsers
| Kolom | Deskripsi |
|-------|-----------|
| id | Unique ID (auto-generated) |
| nama | Nama lengkap |
| nik | Nomor Induk Kependudukan |
| alamat | Alamat lengkap |
| noTelepon | Nomor telepon |
| email | Email |
| jenisLayanan | Jenis layanan yang diminta |
| keterangan | Keterangan tambahan |
| status | pending/verified/rejected/incomplete |
| statusMessage | Pesan dari admin |
| fieldOfficerId | ID petugas lapangan |
| fieldOfficerName | Nama petugas lapangan |
| createdAt | Timestamp dibuat |
| updatedAt | Timestamp diupdate |

### Sheet: Documents
| Kolom | Deskripsi |
|-------|-----------|
| id | Unique ID |
| serviceUserId | ID pemilik dokumen |
| type | Tipe dokumen (KTP, KK, dll) |
| fileName | Nama file |
| fileId | Google Drive file ID |
| fileUrl | URL untuk akses file |
| ocrText | Teks hasil OCR |
| ocrData | Data terstruktur dari OCR (JSON) |
| uploadedAt | Timestamp upload |

### Sheet: Users
| Kolom | Deskripsi |
|-------|-----------|
| id | Unique ID |
| email | Email login |
| password | Password (plain text - untuk demo) |
| fullName | Nama lengkap |
| role | admin/field_officer |
| phone | Nomor telepon |
| createdAt | Timestamp dibuat |
| updatedAt | Timestamp diupdate |

---

## 🔐 KEAMANAN

### Untuk Production:

1. **Ganti API Key** dengan yang lebih kuat
2. **Hash password** di Apps Script (jangan plain text)
3. **Implementasi JWT** atau session token yang proper
4. **Set permission** Google Sheet ke private
5. **Gunakan environment variables** untuk semua credentials
6. **Enable rate limiting** di Apps Script

### Contoh Generate API Key yang Kuat:

```javascript
// Jalankan di browser console
const apiKey = 'kemenkes-' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
  .map(b => b.toString(16).padStart(2, '0'))
  .join('');
console.log(apiKey);
```

---

## 📱 FITUR YANG TERINTEGRASI

### ✅ Form Petugas → Google Sheets
- Data pribadi (nama, NIK, alamat, dll)
- Upload dokumen ke Google Drive
- OCR data tersimpan di sheet Documents
- Auto-generate unique ID
- Timestamp otomatis

### ✅ Verifikasi Admin → Google Sheets
- Update status (verified/rejected/incomplete)
- Tambah pesan/catatan untuk petugas
- Real-time update di sheet
- Activity logs tercatat

### ✅ Notifikasi Real-Time
- Admin dapat notifikasi saat ada pengajuan baru
- Petugas dapat notifikasi saat status berubah
- Tersimpan di sheet Notifications

### ✅ Dashboard Admin
- Lihat semua data yang masuk
- Filter berdasarkan status
- Lihat dokumen yang di-upload
- Download/view dokumen dari Google Drive

---

## 📞 BANTUAN

Jika masih ada masalah:

1. Cek **Execution log** di Apps Script Editor
2. Cek **Browser Console** (F12) untuk error
3. Verifikasi semua ID dan URL sudah benar
4. Test endpoint langsung via browser
5. Pastikan permission Google Sheet & Drive sudah benar

---

**✅ Setelah setup selesai, aplikasi Anda akan:**
- Menyimpan semua data form ke Google Sheets
- Upload dokumen ke Google Drive
- Sinkronisasi real-time antara petugas dan admin
- Tracking semua aktivitas di Activity Logs

**🎉 Selamat! Aplikasi Anda sudah terintegrasi dengan Google Sheets & Apps Script!**
