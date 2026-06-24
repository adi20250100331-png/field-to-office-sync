# ⚡ Quick Setup Google Sheets API - 5 Menit

Setup cepat untuk mengaktifkan integrasi Google Sheets.

---

## 📦 Yang Anda Butuhkan

1. ✅ Google Account
2. ✅ 5 menit waktu
3. ✅ File backend sudah tersedia: `google-apps-script-backend.js`

---

## 🚀 Setup (5 Langkah)

### 1. Buat Google Sheet & Drive Folder

```
1. Buka sheets.google.com → Buat sheet baru "Field-to-Office DB"
2. Copy SPREADSHEET_ID dari URL
3. Buka drive.google.com → Buat folder "Field-to-Office Documents"  
4. Copy FOLDER_ID dari URL
```

### 2. Deploy Apps Script

```
1. Di Google Sheet: Extensions > Apps Script
2. Paste kode dari google-apps-script-backend.js
3. Ganti 3 nilai:
   - SPREADSHEET_ID (line ~27)
   - DRIVE_FOLDER_ID (line ~30)
   - API_KEY (line ~43) - buat random string
4. Save
```

### 3. Initialize Database

```
1. Pilih function: setupDatabase
2. Run (akan minta permission - klik Allow)
3. Tunggu selesai
4. Refresh sheet → 5 tabs baru muncul
```

### 4. Deploy Web App

```
1. Deploy > New deployment
2. Type: Web app
3. Who has access: Anyone ⚠️
4. Deploy
5. Copy Web App URL
```

### 5. Setup Frontend

```bash
# Buat file .env
cp .env.example .env

# Edit .env:
VITE_API_URL=https://script.google.com/macros/s/[ID]/exec
VITE_API_KEY=your-api-key-here

# Restart server
npm run dev
```

---

## ✅ Test

1. Login aplikasi
2. Buat pengajuan baru
3. Check Google Sheet → data muncul ✓
4. Check Google Drive → file muncul ✓

---

## 🔍 Troubleshooting

### Data tidak tersimpan?
```
✓ Check .env ada dan terisi
✓ Restart dev server setelah edit .env
✓ Check API_KEY sama di Apps Script & .env
✓ Test URL di browser: [URL]?action=getServiceUsers&apiKey=[KEY]
```

### CORS error?
```
✓ Deploy dengan "Who has access: Anyone"
✓ Jangan "Only myself"
```

### "Unauthorized" error?
```
✓ API_KEY harus PERSIS SAMA di Apps Script dan .env
✓ Case-sensitive!
```

---

## 📚 Dokumentasi Lengkap

Butuh panduan detail? Lihat:
- **GOOGLE_SHEETS_API_SETUP.md** - Setup lengkap
- **GOOGLE_APPS_SCRIPT_SETUP.md** - Apps Script detail
- **google-apps-script-backend.js** - Source code backend

---

## 💡 Tips

1. **Backup data:** Download sheet as Excel setiap minggu
2. **Monitor:** Apps Script > Executions untuk lihat logs
3. **Security:** Ganti admin password default (admin@test.com)
4. **API Key:** Gunakan random string minimal 20 karakter

---

## ✨ Fitur yang Didapat

- ✅ Auto-save ke Google Sheets
- ✅ Upload dokumen ke Google Drive  
- ✅ Real-time sync
- ✅ Notifications system
- ✅ Activity logs
- ✅ 100% GRATIS!

---

**Setup selesai dalam 5 menit! 🎉**

Questions? Check dokumentasi lengkap atau lihat browser console untuk errors.
