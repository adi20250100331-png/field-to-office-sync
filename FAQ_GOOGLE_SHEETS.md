# ❓ FAQ - GOOGLE SHEETS & APPS SCRIPT INTEGRATION

## 📚 DAFTAR ISI
- [Setup & Konfigurasi](#setup--konfigurasi)
- [Error & Troubleshooting](#error--troubleshooting)
- [Keamanan](#keamanan)
- [Performa & Limits](#performa--limits)
- [Fitur & Fungsionalitas](#fitur--fungsionalitas)
- [Maintenance](#maintenance)

---

## 🔧 SETUP & KONFIGURASI

### Q: Apakah saya harus membuat Google Sheet baru atau bisa pakai yang sudah ada?

**A:** Sebaiknya buat Google Sheet **baru** khusus untuk aplikasi ini. Alasannya:
- Apps Script akan membuat 5 sheet dengan struktur spesifik
- Menghindari konflik dengan data lain
- Lebih mudah di-manage dan di-backup

---

### Q: Apakah API_KEY harus format tertentu?

**A:** Tidak ada format khusus, tapi **recommended**:
- Minimal **10 karakter**
- Kombinasi huruf (a-z, A-Z), angka (0-9), dan simbol (-_)
- Contoh baik: `kemenkes-kupang-2026-api-xyz789`
- Hindari: `12345`, `password`, `admin123`

**Generate API Key yang kuat:**
```javascript
// Jalankan di browser console
'kemenkes-' + Math.random().toString(36).substr(2, 20) + '-' + Date.now()
```

---

### Q: Dimana saya menyimpan API_KEY?

**A:** Simpan di **2 tempat**:
1. **Apps Script**: File `google-apps-script-backend.js` → konstanta `API_KEY`
2. **Frontend**: File `.env.local` → variabel `VITE_API_KEY`

⚠️ **PENTING:** Kedua API_KEY harus **sama persis** (case-sensitive)

---

### Q: Apakah saya perlu bayar untuk Google Sheets API?

**A:** **TIDAK!** 100% gratis. Yang Anda gunakan adalah:
- ✅ Google Sheets (gratis)
- ✅ Google Drive (15GB gratis per akun)
- ✅ Google Apps Script (gratis, quota harian)

Tidak ada biaya apapun untuk personal/internal use.

---

### Q: Berapa lama waktu setup dari awal?

**A:** Sekitar **15-20 menit** jika mengikuti checklist:
- Setup Google Sheets & Drive: 5 menit
- Setup Apps Script: 8 menit
- Deploy Web App: 3 menit
- Integrasi Frontend: 4 menit

---

## 🚨 ERROR & TROUBLESHOOTING

### Q: Error "Unauthorized: Invalid API key"

**A:** API_KEY tidak cocok. Solusi:
1. Buka Apps Script → cek nilai `API_KEY`
2. Buka `.env.local` → cek nilai `VITE_API_KEY`
3. Pastikan **sama persis** (copy-paste untuk menghindari typo)
4. Restart development server (`npm run dev`)

---

### Q: Error "Script function not found: doGet" atau "doPost"

**A:** Apps Script belum di-deploy atau deploy salah. Solusi:
1. Buka Apps Script Editor
2. Klik **Deploy** → **Manage deployments**
3. Klik **Edit** (icon pensil) pada deployment yang ada
4. Klik **Deploy** lagi
5. Copy **Web App URL** yang baru
6. Update `VITE_API_URL` di `.env.local`

---

### Q: Data tidak tersimpan di Google Sheets

**A:** Beberapa kemungkinan:

**1. SPREADSHEET_ID salah:**
   - Buka Google Sheet
   - Cek URL: `docs.google.com/spreadsheets/d/[INI_ID_NYA]/edit`
   - Pastikan ID di Apps Script sama persis

**2. Sheet belum di-setup:**
   - Jalankan function `setupDatabase()` di Apps Script
   - Cek apakah ada 5 sheet: ServiceUsers, Documents, Notifications, Users, ActivityLogs

**3. Permission issue:**
   - Re-authorize Apps Script: Run → Review permissions → Allow
   - Pastikan Apps Script punya akses ke Sheet & Drive

**4. Console error di browser:**
   - Buka Developer Tools (F12) → Console tab
   - Lihat error message untuk detail

---

### Q: Upload dokumen gagal / Error 500

**A:** Kemungkinan DRIVE_FOLDER_ID salah. Solusi:
1. Buka Google Drive folder yang sudah dibuat
2. Cek URL: `drive.google.com/drive/folders/[INI_ID_NYA]`
3. Copy ID (bagian setelah `/folders/`)
4. Update `DRIVE_FOLDER_ID` di Apps Script
5. Save dan redeploy

---

### Q: Error CORS / Cross-Origin

**A:** Deployment Web App permission salah. Solusi:
1. Apps Script → Deploy → Manage deployments
2. Edit deployment
3. **Who has access:** Pastikan pilih **"Anyone"**
4. Deploy ulang
5. Test di browser dengan Incognito mode

---

### Q: Notifikasi tidak muncul di frontend

**A:** Cek beberapa hal:
1. **Apakah tersimpan di Google Sheets?**
   - Buka sheet "Notifications"
   - Lihat apakah ada data baru

2. **Apakah userId benar?**
   - Notifikasi harus punya `userId` yang match dengan user yang login
   
3. **Refresh data:**
   - Reload halaman browser (Ctrl+R atau Cmd+R)

---

### Q: Login admin gagal padahal password benar

**A:** Solusi:
1. Cek sheet "Users" di Google Sheets
2. Pastikan ada user dengan:
   - email: `admin@test.com`
   - password: `admin123`
   - role: `admin`

3. Jika tidak ada, jalankan ulang `setupDatabase()` di Apps Script

4. Atau tambah manual:
   - Buka sheet "Users"
   - Isi baris baru sesuai header columns

---

## 🔐 KEAMANAN

### Q: Apakah data saya aman di Google Sheets?

**A:** **YA**, dengan catatan:
- ✅ Google Sheets memiliki enkripsi SSL/TLS
- ✅ Akses diproteksi dengan Google Account authentication
- ✅ API_KEY mencegah akses unauthorized dari frontend
- ⚠️ Set Google Sheet permission ke "Private" (hanya Anda yang bisa akses)
- ⚠️ Jangan share Sheet/Folder ke publik

---

### Q: Apakah password di-hash?

**A:** **TIDAK** di implementasi default ini. Password disimpan **plain text** di sheet "Users".

**Untuk production**, Anda harus:
1. Hash password dengan library seperti `crypto-js`
2. Tambah salt untuk setiap password
3. Implementasi di Apps Script saat create/update user

**Contoh:** Gunakan fungsi `Utilities.computeDigest()` di Apps Script.

---

### Q: Bagaimana cara menambah user baru (admin/petugas)?

**A:** Ada 2 cara:

**Cara 1: Manual via Google Sheets**
1. Buka sheet "Users"
2. Tambah baris baru dengan data:
   - id: `user-xxx` (unique)
   - email: email user
   - password: password (plain text)
   - fullName: nama lengkap
   - role: `admin` atau `field_officer`
   - phone: nomor telepon
   - createdAt: timestamp ISO 8601
   - updatedAt: timestamp ISO 8601

**Cara 2: Via API** (TODO: buat endpoint createUser di Apps Script)

---

### Q: Apakah orang lain bisa akses data saya?

**A:** **TIDAK**, selama:
- ✅ Google Sheet **tidak di-share** ke publik
- ✅ Google Drive folder **tidak di-share** ke publik
- ✅ API_KEY **tidak bocor** (jangan commit ke GitHub)
- ✅ Web App deployment set "Execute as: Me"

---

## ⚡ PERFORMA & LIMITS

### Q: Berapa batas maksimal data yang bisa disimpan?

**A:** Limits Google Sheets:
- **10 juta cells** per spreadsheet
- **40.000 baris** per sheet (tapi bisa punya banyak sheet)
- **256 kolom** per sheet

**Estimasi kapasitas:**
- ServiceUsers: ~39.000 pengajuan
- Documents: ~39.000 dokumen
- Lebih dari cukup untuk operasional harian

Jika mencapai limit:
- Archive data lama ke sheet terpisah
- Export ke Excel dan buat sheet baru

---

### Q: Berapa batas upload file?

**A:** Limits Google Drive:
- **15 GB** storage gratis per akun Google
- **5 TB** max file size (tapi Apps Script limit: 50 MB per upload)

Untuk aplikasi ini:
- Foto KTP/dokumen: ~500 KB - 2 MB per file
- Estimasi: **7.500 - 30.000 dokumen** per akun

---

### Q: Apakah ada limit request per hari?

**A:** **YA**, Google Apps Script quotas:
- **20.000 URL Fetch calls** per day (free account)
- **6 menit** execution time per request
- **30 MB** return size

Untuk aplikasi ini, **lebih dari cukup** untuk:
- 100-500 pengajuan per hari
- 10-20 admin yang mengakses bersamaan

---

### Q: Apakah cepat untuk real-time sync?

**A:** Rata-rata response time:
- **GET request**: 200-500 ms
- **POST request** (create/update): 500-1500 ms
- **Upload dokumen**: 1-3 detik (tergantung ukuran file)

Tidak se-cepat database tradisional, tapi **acceptable** untuk use case ini.

---

## 🎯 FITUR & FUNGSIONALITAS

### Q: Apakah bisa multiple petugas input data bersamaan?

**A:** **YA!** Google Sheets mendukung concurrent access.
- Multiple petugas bisa submit form bersamaan
- Multiple admin bisa verifikasi bersamaan
- Data akan ter-append ke sheet tanpa konflik

---

### Q: Apakah data real-time?

**A:** **YA**, tapi perlu refresh:
- Frontend akan fetch data terbaru saat page load
- Untuk real-time tanpa refresh, implementasi polling atau WebSocket
- Current implementation: refresh otomatis setiap navigate page

---

### Q: Apakah bisa export data ke Excel?

**A:** **YA**, ada 2 cara:

**Cara 1: Langsung dari Google Sheets**
- Buka Google Sheet
- File → Download → Microsoft Excel (.xlsx)

**Cara 2: Via frontend** (ada function `exportToCSV()`)
- Implementasi di Admin Dashboard
- Export filtered data sesuai kebutuhan

---

### Q: Apakah bisa filter/search data?

**A:** **YA!** Sudah ada fitur:
- **Search bar** di Admin Dashboard
- **Filter by status**: pending, verified, rejected, incomplete
- **Filter by petugas**: fieldOfficerId
- Filter dilakukan di Apps Script (server-side)

---

### Q: Apakah bisa upload multiple dokumen sekaligus?

**A:** **YA!** Frontend mendukung:
- Upload 1-10 dokumen per submission
- Tiap dokumen punya type: KTP, KK, NPWP, OTHER
- OCR bisa extract data dari tiap dokumen

---

### Q: Apakah OCR bekerja offline?

**A:** **TIDAK**. OCR membutuhkan:
- Library Tesseract.js (sudah ter-install)
- Eksekusi di browser (client-side)
- Tidak perlu API key atau koneksi ke server OCR

Tapi butuh **internet** untuk:
- Load library Tesseract.js (first time)
- Upload hasil OCR ke Google Sheets

---

## 🔧 MAINTENANCE

### Q: Bagaimana cara backup data?

**A:** **Otomatis & Manual:**

**Otomatis (by Google):**
- Google Sheets auto-save setiap perubahan
- Revision history: File → Version history

**Manual backup:**
1. **Export Sheet:**
   - File → Download → Excel (.xlsx)
   - Simpan di komputer lokal
   - Lakukan weekly/monthly

2. **Copy Sheet:**
   - File → Make a copy
   - Beri nama: "Field-to-Office DB - Backup [tanggal]"

3. **Export Drive:**
   - Google Takeout (takeout.google.com)
   - Export semua data Drive

---

### Q: Bagaimana cara membersihkan data lama?

**A:** Beberapa opsi:

**Opsi 1: Archive ke sheet terpisah**
```
1. Buka sheet "ServiceUsers"
2. Filter data yang sudah lama (> 6 bulan)
3. Copy rows → paste ke sheet baru "ServiceUsers_Archive_2026"
4. Delete rows dari sheet utama
```

**Opsi 2: Delete via Apps Script**
```javascript
// Tambah function di Apps Script
function archiveOldData() {
  const sheet = getOrCreateSheet(SHEETS.SERVICE_USERS);
  const data = sheet.getDataRange().getValues();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Archive logic here...
}
```

**Opsi 3: Manual delete di Google Sheets**
- Pilih rows yang mau dihapus
- Right click → Delete rows

---

### Q: Bagaimana cara update Apps Script code?

**A:** Steps:
1. Edit code di Apps Script Editor
2. Save (Ctrl+S atau Cmd+S)
3. **PENTING:** Re-deploy:
   - Deploy → Manage deployments
   - Edit → Version: New version
   - Deploy
4. (Opsional) Update Web App URL di `.env.local` jika berubah

---

### Q: Bagaimana cara rollback jika ada kesalahan?

**A:** Google Sheets & Apps Script punya version history:

**Rollback Google Sheets:**
1. File → Version history → See version history
2. Pilih versi sebelum error
3. Klik "Restore this version"

**Rollback Apps Script:**
1. Apps Script Editor
2. File → Version history
3. Pilih versi sebelumnya
4. Redeploy

---

### Q: Berapa sering harus maintenance?

**A:** Recommended schedule:

**Harian:**
- ✅ Check dashboard untuk pengajuan baru
- ✅ Verifikasi data yang masuk

**Mingguan:**
- ✅ Review activity logs
- ✅ Check storage usage Google Drive
- ✅ Test backup restore

**Bulanan:**
- ✅ Archive old data (> 3 bulan)
- ✅ Rotate API_KEY (optional, untuk security)
- ✅ Full backup ke local storage
- ✅ Review & clean up Google Drive files

**Tahunan:**
- ✅ Audit security settings
- ✅ Update dependencies (frontend)
- ✅ Review & optimize Apps Script code

---

## 🆘 BANTUAN LEBIH LANJUT

### Q: Dimana saya bisa dapat bantuan jika masih stuck?

**A:** Resources:

1. **Dokumentasi lengkap:**
   - `/PANDUAN_SETUP_LENGKAP.md`
   - `/CHECKLIST_SETUP.md`
   - `/ARSITEKTUR_INTEGRASI.md`

2. **Google Apps Script Docs:**
   - https://developers.google.com/apps-script

3. **Check Console Logs:**
   - Browser: F12 → Console tab
   - Apps Script: View → Logs

4. **Stack Overflow:**
   - Tag: `google-apps-script`, `google-sheets-api`

---

### Q: Apakah ada video tutorial?

**A:** Saat ini belum ada video tutorial spesifik untuk aplikasi ini. Tapi bisa ikuti:
- Google Apps Script tutorials di YouTube
- React + API integration tutorials
- Google Sheets API tutorials

Keyword: "Google Apps Script Web App Tutorial"

---

### Q: Apakah bisa digunakan untuk production?

**A:** **YA, dengan catatan:**

✅ **Sudah Production-Ready:**
- Real-time sync works
- Upload dokumen works
- Notifikasi works
- Multi-user works

⚠️ **Perlu Enhancement untuk Production:**
- **Password hashing** (sekarang masih plain text)
- **Rate limiting** (prevent abuse)
- **Input validation** yang lebih ketat
- **Error monitoring** (e.g., Sentry)
- **Backup automation** (scheduled)
- **Security audit**

📖 **Recommended:** Baca `/THEME_AND_AUTH_GUIDE.md` untuk security best practices

---

**🎉 Masih ada pertanyaan? Cek dokumentasi lengkap di folder repository!**
