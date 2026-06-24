# 🚀 Setup Google Spreadsheet API - Panduan Lengkap

Panduan ini akan membantu Anda mengintegrasikan Google Spreadsheet API dengan aplikasi Field-to-Office Sync.

---

## 📋 Ringkasan Setup

Aplikasi ini menggunakan **Google Apps Script** sebagai backend yang menghubungkan aplikasi dengan:
- ✅ **Google Sheets** - Sebagai database
- ✅ **Google Drive** - Sebagai storage untuk dokumen
- ✅ **REST API** - Endpoint yang bisa diakses dari web app

---

## 🎯 Langkah-Langkah Setup

### 1️⃣ Setup Google Sheets Database (5 menit)

1. **Buat Google Sheet Baru**
   - Buka [sheets.google.com](https://sheets.google.com)
   - Klik **Blank** untuk membuat sheet kosong
   - Rename menjadi: **"Field-to-Office DB"**

2. **Copy Spreadsheet ID**
   - Lihat URL: `https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit`
   - Copy bagian `[SPREADSHEET_ID]`
   - Simpan untuk nanti

### 2️⃣ Setup Google Drive Storage (2 menit)

1. **Buat Folder untuk Dokumen**
   - Buka [drive.google.com](https://drive.google.com)
   - Klik **New** > **Folder**
   - Nama: **"Field-to-Office Documents"**

2. **Set Permissions**
   - Klik kanan folder > **Share**
   - Change to: **Anyone with the link can view**

3. **Copy Folder ID**
   - Lihat URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`
   - Copy bagian `[FOLDER_ID]`
   - Simpan untuk nanti

### 3️⃣ Deploy Google Apps Script Backend (10 menit)

1. **Buka Apps Script Editor**
   - Buka Google Sheet yang sudah dibuat
   - Menu: **Extensions** > **Apps Script**
   - Delete kode default

2. **Copy Backend Code**
   - Buka file `google-apps-script-backend.js` di project ini
   - Copy **seluruh isi** file
   - Paste di Apps Script editor

3. **Konfigurasi Backend**
   
   Cari dan ganti 3 nilai berikut (sekitar line 16-35):

   ```javascript
   // Ganti dengan Spreadsheet ID Anda
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // ← GANTI!
   
   // Ganti dengan Drive Folder ID Anda
   const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // ← GANTI!
   
   // Buat API Key sendiri (random string)
   const API_KEY = 'your-secret-api-key-here'; // ← GANTI!
   ```

   **Contoh API Key yang baik:**
   ```javascript
   const API_KEY = 'f2o_2026_kJ8mN4pQ9rT2vX5yZ7aB3cD6';
   ```

4. **Save Project**
   - Tekan `Ctrl+S` atau klik icon **Save**
   - Rename project: Klik "Untitled project" → **"Field-to-Office Backend"**

5. **Initialize Database**
   
   Jalankan fungsi setup (hanya sekali):
   
   - Pilih function dropdown: **setupDatabase**
   - Klik **Run** (▶️ icon)
   - Pertama kali akan minta permission:
     - Klik **Review permissions**
     - Pilih akun Google Anda
     - Klik **Advanced** > **Go to Field-to-Office Backend (unsafe)**
     - Klik **Allow**
   
   - Tunggu sampai selesai (cek **Execution log**)
   - Refresh Google Sheet → akan muncul 5 sheets baru:
     - ServiceUsers
     - Documents
     - Notifications
     - Users
     - ActivityLogs

   > ⚠️ **Sheet Users** akan otomatis punya 1 admin:
   > - Email: `admin@test.com`
   > - Password: `admin123`
   > - **PENTING: Ganti password ini setelah setup!**

6. **Deploy as Web App**
   
   - Klik **Deploy** > **New deployment**
   - Klik icon **⚙️** > Select type: **Web app**
   - Isi form:
     - **Description**: "Field-to-Office API v1"
     - **Execute as**: **Me** (your-email@gmail.com)
     - **Who has access**: **Anyone** ⚠️ PENTING!
   - Klik **Deploy**
   - **Copy Web App URL**:
     ```
     https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
     ```
   - **SIMPAN URL INI** - akan digunakan di frontend!

7. **Test Deployment**
   
   Buka URL berikut di browser:
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec?action=getServiceUsers&apiKey=[API_KEY_ANDA]
   ```
   
   Harusnya dapat response:
   ```json
   {
     "success": true,
     "data": [],
     "timestamp": "2026-03-05T..."
   }
   ```

### 4️⃣ Konfigurasi Frontend (3 menit)

1. **Create .env File**
   
   - Copy file `.env.example` menjadi `.env`:
     ```bash
     cp .env.example .env
     ```
   
   - Atau buat file `.env` baru di root project

2. **Update Environment Variables**
   
   Edit file `.env`:
   ```env
   # Google Apps Script Backend
   VITE_API_URL=https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
   VITE_API_KEY=f2o_2026_kJ8mN4pQ9rT2vX5yZ7aB3cD6
   
   # Storage type
   VITE_STORAGE_TYPE=google-apps-script
   ```
   
   **Ganti:**
   - `[DEPLOYMENT_ID]` dengan deployment ID dari Web App URL
   - API_KEY dengan API key yang sama di Apps Script

3. **Restart Dev Server**
   ```bash
   # Stop server (Ctrl+C)
   # Start lagi
   npm run dev
   ```

---

## 🧪 Testing API

### Test di Browser

1. **Get All Service Users**
   ```
   https://script.google.com/macros/s/[ID]/exec?action=getServiceUsers&apiKey=[KEY]
   ```

2. **Create Service User (gunakan Postman)**
   ```http
   POST https://script.google.com/macros/s/[ID]/exec?action=createServiceUser&apiKey=[KEY]
   Content-Type: application/json
   
   {
     "data": {
       "nama": "Test User",
       "nik": "1234567890123456",
       "alamat": "Jakarta",
       "noTelepon": "081234567890",
       "email": "test@example.com",
       "jenisLayanan": "Pemeriksaan Jenazah",
       "keterangan": "Test",
       "fieldOfficerId": "test-123",
       "fieldOfficerName": "Test Officer"
     }
   }
   ```

### Test di Aplikasi

1. Login sebagai field officer (adhy, budi, atau siti)
2. Buat pengajuan baru
3. Check Google Sheets → data muncul di sheet **ServiceUsers**
4. Upload dokumen → file muncul di Google Drive
5. Login sebagai admin (gunakan akun lain)
6. Verifikasi data → status berubah di Google Sheets

---

## 📊 Struktur Data di Google Sheets

### Sheet: ServiceUsers
| Kolom | Deskripsi |
|-------|-----------|
| id | Unique ID (auto-generated) |
| nama | Nama lengkap |
| nik | Nomor Induk Kependudukan |
| alamat | Alamat lengkap |
| noTelepon | Nomor telepon |
| email | Email |
| jenisLayanan | Jenis layanan |
| keterangan | Keterangan tambahan |
| status | pending/verified/rejected/incomplete |
| statusMessage | Pesan dari admin |
| fieldOfficerId | ID field officer |
| fieldOfficerName | Nama field officer |
| createdAt | Tanggal dibuat |
| updatedAt | Tanggal diupdate |

### Sheet: Documents
| Kolom | Deskripsi |
|-------|-----------|
| id | Unique ID |
| serviceUserId | ID user terkait |
| type | KTP/KK/NPWP/OTHER |
| fileName | Nama file |
| fileId | Google Drive file ID |
| fileUrl | URL file di Drive |
| ocrText | Full OCR text |
| ocrData | Extracted data (JSON) |
| uploadedAt | Tanggal upload |

### Sheet: Notifications
| Kolom | Deskripsi |
|-------|-----------|
| id | Unique ID |
| userId | ID user penerima |
| serviceUserId | ID pengajuan terkait |
| userName | Nama user |
| message | Pesan notifikasi |
| type | new/status-change/system |
| read | true/false |
| createdAt | Tanggal dibuat |

---

## 🔐 Security Best Practices

1. **Ganti API Key**
   - Jangan gunakan default key
   - Gunakan random string minimal 20 karakter
   - Generate dengan: `openssl rand -hex 20`

2. **Ganti Admin Password**
   - Buka Sheet **Users**
   - Edit password admin
   - Gunakan password yang kuat

3. **Backup Data Reguler**
   - Download Google Sheet sebagai Excel
   - Simpan di tempat aman
   - Lakukan setiap minggu

4. **Monitor Executions**
   - Apps Script > **Executions** (sidebar)
   - Check error logs
   - Monitor performance

---

## 🐛 Troubleshooting

### "Missing action parameter"
**Solusi:** Pastikan URL punya parameter `?action=xxx&apiKey=xxx`

### "Unauthorized: Invalid API key"
**Solusi:** 
- Check API_KEY di Apps Script (line ~35)
- Check VITE_API_KEY di `.env`
- Pastikan sama persis (case-sensitive)

### "Spreadsheet not found"
**Solusi:**
- Check SPREADSHEET_ID benar
- Pastikan sheet tidak dihapus
- Script punya permission ke sheet

### CORS Error
**Solusi:**
- Deploy dengan "Who has access: **Anyone**"
- Jangan "Only myself"

### Data tidak muncul di aplikasi
**Solusi:**
- Check browser console untuk errors
- Check Network tab untuk API responses
- Restart dev server setelah update .env
- Clear browser cache

---

## 📈 Monitoring & Maintenance

### View Logs
- Apps Script editor > **Executions** (sidebar kiri)
- Lihat semua API calls dan errors

### View Data Real-time
- Buka Google Sheet
- Lihat data di masing-masing tab
- Refresh untuk lihat data terbaru

### Update Backend
Jika perlu update kode backend:
1. Edit kode di Apps Script
2. Save (Ctrl+S)
3. Deploy > Manage deployments
4. Edit deployment yang aktif
5. Version: New version
6. Deploy

> ✅ URL tidak berubah, frontend tidak perlu update!

---

## ✅ Checklist Setup

**Backend:**
- [ ] Google Sheet dibuat
- [ ] Spreadsheet ID di-copy
- [ ] Google Drive folder dibuat
- [ ] Folder ID di-copy
- [ ] Kode backend di-paste ke Apps Script
- [ ] SPREADSHEET_ID diganti
- [ ] DRIVE_FOLDER_ID diganti
- [ ] API_KEY diganti
- [ ] Function setupDatabase dijalankan
- [ ] 5 sheets otomatis terbuat
- [ ] Deploy as Web App berhasil
- [ ] Web App URL di-copy
- [ ] Test API di browser berhasil

**Frontend:**
- [ ] File .env dibuat
- [ ] VITE_API_URL diisi dengan Web App URL
- [ ] VITE_API_KEY diisi dengan API key
- [ ] Dev server di-restart
- [ ] Test create service user berhasil
- [ ] Data muncul di Google Sheets
- [ ] Upload dokumen berhasil
- [ ] File muncul di Google Drive

**Security:**
- [ ] Admin password diganti
- [ ] API key diganti dari default
- [ ] Backup data pertama dibuat

---

## 🎉 Setup Complete!

Aplikasi Anda sekarang terhubung dengan Google Spreadsheet API!

**Keuntungan:**
- ✅ Data tersimpan di Google Sheets (bisa diakses kapan saja)
- ✅ Dokumen tersimpan di Google Drive (aman dan terorganisir)
- ✅ Real-time sync antara field officer dan admin
- ✅ 100% GRATIS - tidak ada biaya server
- ✅ Otomatis scale - Google yang handle
- ✅ Mudah maintenance - edit langsung di browser

**Next Steps:**
1. Test semua fitur end-to-end
2. Training team untuk gunakan sistem
3. Setup backup schedule
4. Monitor logs untuk troubleshooting

---

## 📞 Support & Resources

- **Dokumentasi Lengkap:** [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)
- **Backend Code:** [google-apps-script-backend.js](./google-apps-script-backend.js)
- **API Client:** [/src/lib/api.ts](./src/lib/api.ts)
- **Google Apps Script Docs:** https://developers.google.com/apps-script

---

**Happy Coding! 🚀**
