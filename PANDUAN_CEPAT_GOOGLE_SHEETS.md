# 📱 Panduan Cepat Integrasi Google Sheets

Panduan singkat dalam Bahasa Indonesia untuk setup Google Sheets API.

---

## 🎯 Apa yang Sudah Siap?

✅ **Backend Code**: File `google-apps-script-backend.js` sudah ada
✅ **API Client**: File `/src/lib/api.ts` sudah ada  
✅ **Integration**: DataContext sudah terintegrasi
✅ **Documentation**: Panduan lengkap tersedia

**Yang Perlu Anda Lakukan:** Setup & konfigurasi (5 menit)

---

## ⚡ Setup Super Cepat (5 Menit)

### Langkah 1: Buat Google Sheet (1 menit)

1. Buka [sheets.google.com](https://sheets.google.com)
2. Klik **Blank** (buat sheet kosong)
3. Rename menjadi: **"Field-to-Office DB"**
4. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/COPY_BAGIAN_INI/edit
   ```
5. Simpan ID ini!

### Langkah 2: Buat Google Drive Folder (1 menit)

1. Buka [drive.google.com](https://drive.google.com)
2. Klik **New** > **Folder**
3. Nama: **"Field-to-Office Documents"**
4. Klik kanan folder > **Share** > Pilih **Anyone with the link can view**
5. Copy **Folder ID** dari URL:
   ```
   https://drive.google.com/drive/folders/COPY_BAGIAN_INI
   ```
6. Simpan ID ini!

### Langkah 3: Deploy Apps Script (2 menit)

1. Buka Google Sheet yang tadi dibuat
2. Menu: **Extensions** > **Apps Script**
3. Hapus kode default yang ada
4. Copy **seluruh isi** file `google-apps-script-backend.js` dari project ini
5. Paste di Apps Script editor
6. **PENTING:** Ganti 3 nilai ini:
   
   ```javascript
   // Sekitar line 27
   const SPREADSHEET_ID = 'PASTE_SPREADSHEET_ID_ANDA';
   
   // Sekitar line 30
   const DRIVE_FOLDER_ID = 'PASTE_FOLDER_ID_ANDA';
   
   // Sekitar line 43 - buat password acak
   const API_KEY = 'buatPasswordAcakMinimal20Karakter123';
   ```

7. Save (Ctrl+S)
8. Rename project: Klik "Untitled project" → **"Field-to-Office Backend"**

### Langkah 4: Initialize Database (30 detik)

1. Di Apps Script, pilih function dropdown: **setupDatabase**
2. Klik **Run** (▶️ icon)
3. Pertama kali akan minta permission:
   - Klik **Review permissions**
   - Pilih akun Google Anda
   - Klik **Advanced**
   - Klik **Go to Field-to-Office Backend (unsafe)**
   - Klik **Allow**
4. Tunggu selesai (lihat **Execution log**)
5. Refresh Google Sheet → akan muncul 5 sheets baru!

> 💡 **Tips:** Sheet "Users" akan punya 1 admin default:
> - Email: `admin@test.com`
> - Password: `admin123`  
> - **GANTI PASSWORD INI SETELAH SETUP!**

### Langkah 5: Deploy Web App (1 menit)

1. Klik **Deploy** > **New deployment**
2. Klik icon **⚙️** > Select type: **Web app**
3. Isi:
   - Description: "Field-to-Office API v1"
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️ PENTING!
4. Klik **Deploy**
5. **Copy Web App URL** yang muncul:
   ```
   https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   ```
6. Simpan URL ini!

### Langkah 6: Setup Frontend (30 detik)

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit file `.env` (buka dengan text editor):
   ```env
   VITE_API_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
   VITE_API_KEY=buatPasswordAcakMinimal20Karakter123
   ```
   
   **Ganti:**
   - `DEPLOYMENT_ID` → dari Web App URL tadi
   - `API_KEY` → sama dengan yang di Apps Script

3. **Restart dev server:**
   ```bash
   # Tekan Ctrl+C untuk stop
   # Lalu jalankan lagi:
   npm run dev
   ```

---

## ✅ Test Setup

### Test 1: API di Browser

Buka URL ini di browser (ganti `[...]` dengan value Anda):

```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec?action=getServiceUsers&apiKey=[API_KEY]
```

**Harusnya muncul:**
```json
{
  "success": true,
  "data": [],
  "timestamp": "2026-03-05T..."
}
```

### Test 2: Di Aplikasi

1. Buka aplikasi (http://localhost:3000)
2. Login sebagai field officer (username: `adhy`, password: `adhy123`)
3. Klik **"Buat Pengajuan Baru"**
4. Isi form dan submit
5. **Check Google Sheet** → data muncul di tab "ServiceUsers"! ✅
6. **Check Google Drive** → file muncul di folder! ✅

### Test 3: Browser Console

Buka browser console (F12) dan ketik:

```javascript
await window.googleSheetsTest.quickTest()
```

**Output yang benar:**
```
⚡ Quick Test
Configured: true
✅ API is working!
```

---

## 🎉 Selesai!

**Aplikasi Anda sekarang terhubung dengan Google Sheets!**

### Yang Bisa Dilakukan:
✅ Data otomatis tersimpan ke Google Sheets  
✅ Dokumen otomatis tersimpan ke Google Drive  
✅ Field officer bisa create pengajuan  
✅ Admin bisa verifikasi/tolak pengajuan  
✅ Notifications otomatis  
✅ Activity logs lengkap  

### Keuntungan:
✅ **100% GRATIS** - tidak ada biaya server  
✅ **Otomatis backup** - Google yang handle  
✅ **Akses dari mana saja** - cloud-based  
✅ **Export mudah** - download Excel kapan saja  

---

## 🔧 Troubleshooting

### Data tidak tersimpan ke Google Sheets?

**Check:**
1. File `.env` sudah ada di root project?
2. Sudah restart dev server setelah buat `.env`?
3. API_KEY di `.env` sama persis dengan di Apps Script?
4. Test URL di browser berhasil?

**Solusi:**
```bash
# 1. Check file .env ada
ls -la .env

# 2. Check isi .env
cat .env

# 3. Restart dev server
npm run dev
```

### Error "Unauthorized"?

**Masalah:** API_KEY tidak cocok

**Solusi:**
1. Buka Apps Script → check `API_KEY` (sekitar line 43)
2. Buka `.env` → check `VITE_API_KEY`
3. Pastikan SAMA PERSIS (case-sensitive)
4. Restart dev server

### Error CORS?

**Masalah:** Deployment setting salah

**Solusi:**
1. Apps Script > Deploy > Manage deployments
2. Edit deployment yang aktif
3. **Who has access** harus: **Anyone**
4. Bukan "Only myself"
5. Update deployment

### Data tidak muncul di aplikasi?

**Check:**
1. Browser console ada error?
2. Network tab (F12) > filter "exec" > lihat response
3. Status indicator menunjukkan "Connected"?

**Test:**
```javascript
// Di browser console
import { getApiConfig } from './src/lib/api'
console.log(getApiConfig())
```

---

## 📊 Monitoring

### Lihat Data Real-time

1. Buka Google Sheet
2. Lihat tab-tab:
   - **ServiceUsers** - semua pengajuan
   - **Documents** - metadata dokumen
   - **Notifications** - notifikasi sistem
   - **Users** - user accounts
   - **ActivityLogs** - audit trail

### Lihat Logs API

1. Buka Apps Script editor
2. Klik **Executions** (di sidebar kiri)
3. Lihat semua API calls dan errors

### Export Data

1. Buka Google Sheet
2. **File** > **Download** > **Microsoft Excel (.xlsx)**
3. Save untuk backup

---

## 🔐 Security Tips

### 1. Ganti Admin Password

**PENTING:** Password default tidak aman!

1. Buka Google Sheet
2. Tab **Users**
3. Edit password admin (baris 2)
4. Gunakan password yang kuat

### 2. Ganti API Key

Jangan gunakan API key yang mudah ditebak:

```javascript
// ❌ JANGAN ini
const API_KEY = 'test123';

// ✅ GUNAKAN ini (random, panjang)
const API_KEY = 'f2o_2026_kJ8mN4pQ9rT2vX5yZ7aB3cD6eF1gH';
```

Generate random key:
```bash
openssl rand -hex 20
```

### 3. Backup Rutin

**Jadwal:** Setiap Minggu Jumat

1. Download Google Sheet as Excel
2. Simpan di tempat aman
3. Beri nama: `Backup_YYYY-MM-DD.xlsx`

---

## 📚 Dokumentasi Lengkap

Butuh panduan lebih detail?

- **[QUICK_SETUP_GOOGLE_SHEETS.md](./QUICK_SETUP_GOOGLE_SHEETS.md)** - English version
- **[GOOGLE_SHEETS_API_SETUP.md](./GOOGLE_SHEETS_API_SETUP.md)** - Setup lengkap
- **[GOOGLE_SHEETS_INTEGRATION.md](./GOOGLE_SHEETS_INTEGRATION.md)** - Technical docs
- **[TEST_API.md](./TEST_API.md)** - Testing guide

---

## 💡 Tips & Tricks

### Lihat Status Koneksi

Tambahkan component ini di halaman admin:

```tsx
import { GoogleSheetsStatus } from '@/components/GoogleSheetsStatus'

<GoogleSheetsStatus />
```

### Quick Test di Console

```javascript
// Test cepat
await window.googleSheetsTest.quickTest()

// Test lengkap (7 tests)
await window.googleSheetsTest.runAllTests()
```

### Export Data

```javascript
// Export service users ke CSV
import GoogleSheetsService from '@/lib/google-sheets.service'
GoogleSheetsService.exportToCSV(serviceUsers, 'backup.csv')
```

---

## 🎓 Video Tutorial (Opsional)

Ingin lebih visual? Rekam video sendiri:

1. Follow panduan ini step-by-step
2. Rekam screen dengan OBS/Loom
3. Share ke team untuk training

---

## 📞 Bantuan

### Stuck? Check ini dulu:

1. ✅ `.env` file ada dan terisi dengan benar?
2. ✅ Dev server sudah di-restart?
3. ✅ API_KEY di Apps Script dan .env sama persis?
4. ✅ Test URL di browser berhasil?
5. ✅ Browser console ada error message?

### Masih error?

1. Check **browser console** (F12)
2. Check **Network tab** > filter "exec"
3. Check **Apps Script Executions**
4. Lihat error message lengkap
5. Search di documentation

---

## ✨ Checklist Setup

**Backend:**
- [ ] Google Sheet dibuat ✓
- [ ] Spreadsheet ID di-copy ✓
- [ ] Drive folder dibuat ✓
- [ ] Folder ID di-copy ✓
- [ ] Apps Script code di-paste ✓
- [ ] SPREADSHEET_ID diganti ✓
- [ ] DRIVE_FOLDER_ID diganti ✓
- [ ] API_KEY diganti ✓
- [ ] setupDatabase() dijalankan ✓
- [ ] 5 sheets terbuat otomatis ✓
- [ ] Deploy as Web App ✓
- [ ] Web App URL di-copy ✓

**Frontend:**
- [ ] .env file dibuat ✓
- [ ] VITE_API_URL diisi ✓
- [ ] VITE_API_KEY diisi ✓
- [ ] Dev server di-restart ✓
- [ ] Test API di browser berhasil ✓
- [ ] Test create user berhasil ✓
- [ ] Data muncul di Google Sheets ✓

**Security:**
- [ ] Admin password diganti ✓
- [ ] API key diganti dari default ✓
- [ ] Backup data pertama dibuat ✓

---

## 🎊 Selamat!

**Setup berhasil!** Aplikasi Anda sekarang:

✅ Tersinkronisasi dengan Google Sheets  
✅ Auto-upload dokumen ke Google Drive  
✅ Real-time notifications  
✅ Activity logging  
✅ Siap untuk production  

**Next Steps:**
1. Train field officers cara pakai aplikasi
2. Setup backup schedule (setiap minggu)
3. Monitor usage di Apps Script Executions
4. Collect feedback dari users

---

**Selamat menggunakan Field-to-Office Sync! 🚀**

*Questions? Check dokumentasi atau browser console untuk error details.*
