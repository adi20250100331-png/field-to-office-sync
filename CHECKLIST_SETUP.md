# ✅ CHECKLIST SETUP GOOGLE SHEETS & APPS SCRIPT

> **Estimasi Waktu:** 15-20 menit
> **Level:** Pemula - Menengah

---

## 📦 PERSIAPAN

- [ ] Punya akun Google
- [ ] Akses ke Google Sheets
- [ ] Akses ke Google Drive
- [ ] Browser modern (Chrome, Firefox, Edge)
- [ ] Text editor untuk edit konfigurasi

---

## 🗂️ BAGIAN 1: SETUP GOOGLE SHEETS (5 menit)

### Step 1: Buat Google Sheet
- [ ] Buka https://sheets.google.com
- [ ] Klik "Blank" untuk sheet baru
- [ ] Rename menjadi: **"Field-to-Office DB"**
- [ ] Copy Spreadsheet ID dari URL
  ```
  URL: https://docs.google.com/spreadsheets/d/1h__uXbr0lFiTRxkDbKVSwN-e8JhEtlAzLpwZqmyMdEA/edit
                                                   ↑ Copy bagian ini ↑
  ```
- [ ] Simpan ID: `_______________________________`

### Step 2: Buat Google Drive Folder
- [ ] Buka https://drive.google.com
- [ ] Klik "New" → "Folder"
- [ ] Nama folder: **"Field-to-Office Documents"**
- [ ] Buka folder, copy ID dari URL
  ```
  URL: https://drive.google.com/drive/folders/1ABC123xyz456
                                                ↑ Copy bagian ini ↑
  ```
- [ ] Simpan ID: `_______________________________`

---

## 💻 BAGIAN 2: SETUP APPS SCRIPT (8 menit)

### Step 3: Buka Apps Script Editor
- [ ] Di Google Sheet, klik **Extensions** → **Apps Script**
- [ ] Hapus kode default `function myFunction() {...}`

### Step 4: Copy & Paste Kode Backend
- [ ] Buka file `/google-apps-script-backend.js` di repository
- [ ] Copy SEMUA kode (Ctrl+A → Ctrl+C)
- [ ] Paste di Apps Script Editor (Ctrl+V)
- [ ] Klik **Save** (💾 atau Ctrl+S)

### Step 5: Update Konfigurasi
Cari baris 27-31 di Apps Script dan ganti:

- [ ] Ganti `SPREADSHEET_ID`:
  ```javascript
  const SPREADSHEET_ID = 'PASTE_ID_DARI_STEP_1';
  ```

- [ ] Ganti `DRIVE_FOLDER_ID`:
  ```javascript
  const DRIVE_FOLDER_ID = 'PASTE_ID_DARI_STEP_2';
  ```

- [ ] Ganti `API_KEY` (buat password yang kuat):
  ```javascript
  const API_KEY = 'kemenkes-kupang-2026-secure-abc123';
  ```
  **Simpan API Key ini:** `_______________________________`

- [ ] Klik **Save** lagi

### Step 6: Setup Database (Jalankan Sekali)
- [ ] Pilih function **`setupDatabase`** dari dropdown
- [ ] Klik tombol **Run** (▶️)
- [ ] **IMPORTANT:** Authorize aplikasi:
  - [ ] Klik "Review permissions"
  - [ ] Pilih akun Google Anda
  - [ ] Klik "Advanced" → "Go to ... (unsafe)"
  - [ ] Klik "Allow"
- [ ] Tunggu hingga "Execution completed"
- [ ] Cek Google Sheet - ada 5 sheet baru:
  - [ ] ServiceUsers
  - [ ] Documents
  - [ ] Notifications
  - [ ] Users
  - [ ] ActivityLogs

### Step 7: Verifikasi Admin User
- [ ] Buka sheet **"Users"** di Google Sheet
- [ ] Pastikan ada baris dengan:
  - Email: `admin@test.com`
  - Password: `admin123`
  - Role: `admin`

---

## 🚀 BAGIAN 3: DEPLOY WEB APP (3 menit)

### Step 8: Deploy Apps Script
- [ ] Klik tombol **"Deploy"** → **"New deployment"**
- [ ] Klik icon ⚙️ → pilih **"Web app"**
- [ ] Isi konfigurasi:
  - [ ] Description: `Field-to-Office Sync API v1`
  - [ ] Execute as: **Me** (email Anda)
  - [ ] Who has access: **Anyone** ⚠️ PENTING!
- [ ] Klik **"Deploy"**
- [ ] Copy **Web App URL**:
  ```
  https://script.google.com/macros/s/AKfycbxxx.../exec
  ```
- [ ] Simpan URL: `_______________________________`
- [ ] Klik **"Done"**

### Step 9: Test Deployment
- [ ] Buka URL berikut di browser baru:
  ```
  PASTE_WEB_APP_URL?action=getServiceUsers&apiKey=PASTE_API_KEY
  ```
  Contoh:
  ```
  https://script.google.com/macros/s/AKfycbxxx.../exec?action=getServiceUsers&apiKey=kemenkes-kupang-2026-secure-abc123
  ```
- [ ] Pastikan muncul response JSON:
  ```json
  {
    "success": true,
    "data": [],
    "timestamp": "2026-03-05T..."
  }
  ```

✅ **Jika muncul JSON di atas, deployment BERHASIL!**

---

## 🔗 BAGIAN 4: INTEGRASI FRONTEND (4 menit)

### Step 10: Setup Environment Variables
- [ ] Di root project, copy file `.env.example` → `.env.local`:
  ```bash
  cp .env.example .env.local
  ```

- [ ] Edit file `.env.local`:
  ```env
  VITE_API_URL=PASTE_WEB_APP_URL_DARI_STEP_8
  VITE_API_KEY=PASTE_API_KEY_DARI_STEP_5
  ```

  **Contoh:**
  ```env
  VITE_API_URL=https://script.google.com/macros/s/AKfycbxNB8K3zVq4Jp9mH2L5rC8wT6fE1dG9yU4sX7vQ2pN3kM5jR8tW/exec
  VITE_API_KEY=kemenkes-kupang-2026-secure-abc123
  ```

- [ ] Save file `.env.local`

### Step 11: Restart Development Server
- [ ] Stop server jika sedang berjalan (Ctrl+C)
- [ ] Jalankan ulang:
  ```bash
  npm run dev
  ```
- [ ] Buka browser: http://localhost:5173

---

## 🧪 BAGIAN 5: TESTING (5 menit)

### Test 1: Login Admin
- [ ] Klik **"Login Admin"** di homepage
- [ ] Masukkan:
  - Email: `admin@test.com`
  - Password: `admin123`
- [ ] Klik **"Masuk"**
- [ ] Pastikan berhasil masuk ke Dashboard Admin

### Test 2: Input Data Petugas
- [ ] Logout dari Admin
- [ ] Login sebagai **Petugas** (gunakan kredensial demo)
- [ ] Buka halaman **"Data Collection Form"**
- [ ] Isi semua field:
  - [ ] Nama: `Test User`
  - [ ] NIK: `3571234567890001`
  - [ ] Alamat: `Jl. Test No. 123`
  - [ ] No. Telepon: `081234567890`
  - [ ] Email: `test@example.com`
  - [ ] Jenis Layanan: Pilih salah satu
  - [ ] Keterangan: `Testing integrasi Google Sheets`
- [ ] Upload 1-2 dokumen (foto KTP/lainnya)
- [ ] Klik **"Submit"**
- [ ] Pastikan muncul notifikasi sukses

### Test 3: Verifikasi di Google Sheets
- [ ] Buka Google Sheet **"Field-to-Office DB"**
- [ ] Buka sheet **"ServiceUsers"**
- [ ] Pastikan ada baris baru dengan data yang baru diinput
- [ ] Buka sheet **"Documents"**
- [ ] Pastikan ada dokumen yang di-upload
- [ ] Klik link `fileUrl` di kolom → pastikan gambar bisa dibuka

### Test 4: Verifikasi Admin
- [ ] Login kembali sebagai **Admin**
- [ ] Di Dashboard Admin, lihat data yang baru masuk
- [ ] Klik pada data untuk review
- [ ] Ubah status menjadi **"Terverifikasi"**
- [ ] Tambah catatan: `Dokumen sudah lengkap dan valid`
- [ ] Klik **"Kirim Verifikasi"**
- [ ] Buka Google Sheet → sheet **"ServiceUsers"**
- [ ] Pastikan kolom `status` berubah menjadi `verified`
- [ ] Pastikan kolom `statusMessage` terisi dengan catatan

### Test 5: Check Notifications
- [ ] Buka sheet **"Notifications"**
- [ ] Pastikan ada notifikasi untuk admin (pengajuan baru)
- [ ] Pastikan ada notifikasi untuk petugas (status berubah)

---

## 🎉 SELESAI!

Jika semua test berhasil, berarti aplikasi Anda sudah **FULLY INTEGRATED** dengan Google Sheets!

### ✅ Yang Sudah Berfungsi:
- ✅ Form petugas → Data tersimpan di Google Sheets
- ✅ Upload dokumen → File tersimpan di Google Drive
- ✅ Verifikasi admin → Status terupdate di Google Sheets
- ✅ Notifikasi real-time → Tercatat di sheet Notifications
- ✅ Activity logs → Semua aktivitas tercatat

---

## 📊 RINGKASAN KONFIGURASI ANDA

**Simpan informasi ini untuk referensi:**

```
SPREADSHEET_ID: _______________________________
DRIVE_FOLDER_ID: _______________________________
API_KEY: _______________________________
WEB_APP_URL: _______________________________

Admin Login:
  Email: admin@test.com
  Password: admin123
```

---

## 🆘 TROUBLESHOOTING CEPAT

### ❌ Error: "Unauthorized: Invalid API key"
→ API_KEY di Apps Script ≠ API_KEY di .env.local
→ Pastikan sama persis (case-sensitive)

### ❌ Error: "Script function not found"
→ Apps Script belum di-deploy atau deploy gagal
→ Redeploy: Deploy → Manage deployments → Edit → Deploy

### ❌ Data tidak tersimpan di Google Sheets
→ SPREADSHEET_ID salah atau tidak ada permission
→ Cek ID, jalankan ulang setupDatabase()

### ❌ Upload dokumen gagal
→ DRIVE_FOLDER_ID salah atau folder tidak accessible
→ Cek ID folder, pastikan folder tidak di-trash

### ❌ CORS error di browser
→ Deployment Web App belum set ke "Anyone"
→ Deploy → Manage → Edit → Who has access: Anyone

---

## 📖 DOKUMENTASI LENGKAP

Untuk panduan detail, lihat:
- `/PANDUAN_SETUP_LENGKAP.md` - Panduan lengkap step-by-step
- `/google-apps-script-backend.js` - Dokumentasi API endpoints
- `/QUICK_REFERENCE.md` - Quick reference guide

---

**🚀 Selamat! Aplikasi Anda siap digunakan!**
