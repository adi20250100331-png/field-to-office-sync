# 🚀 Google Apps Script Backend - Complete Package

Dokumentasi lengkap untuk setup backend menggunakan Google Apps Script sebagai alternatif Supabase.

---

## 📦 File Package

| File | Deskripsi | Lokasi |
|------|-----------|--------|
| **google-apps-script-backend.js** | Kode backend lengkap | Copy ke Apps Script |
| **GOOGLE_APPS_SCRIPT_SETUP.md** | Panduan setup step-by-step | Dokumentasi |
| **api.ts** | API client untuk frontend | /src/lib/api.ts |
| **DATACONTEXT_API_EXAMPLES.tsx** | Contoh implementasi | Reference |

---

## ⚡ Quick Start (5 Menit)

### 1️⃣ Setup Backend (2 menit)

```bash
1. Buat Google Sheet baru: "Field-to-Office DB"
2. Buka Extensions > Apps Script
3. Copy paste: google-apps-script-backend.js
4. Ganti 3 values:
   - SPREADSHEET_ID
   - DRIVE_FOLDER_ID  
   - API_KEY
5. Save + Deploy as Web App
6. Copy Web App URL
```

### 2️⃣ Setup Frontend (2 menit)

```bash
1. Copy api.ts ke: src/lib/api.ts
2. Update .env:
   VITE_API_URL=https://script.google.com/.../exec
   VITE_API_KEY=your-api-key
3. Update DataContext dengan API calls
4. Test!
```

### 3️⃣ Initialize Database (1 menit)

```bash
1. Di Apps Script, pilih function: setupDatabase
2. Run (akan minta permission pertama kali)
3. Check Google Sheet - 5 sheets terbuat!
4. Login admin: admin@test.com / admin123
```

---

## 🎯 Fitur Backend

### ✅ Sudah Termasuk:

- **CRUD Service Users** - Create, Read, Update, Delete
- **Document Storage** - Upload ke Google Drive otomatis
- **OCR Support** - Save OCR text & extracted data
- **Notifications System** - Real-time notifications
- **Activity Logs** - Audit trail lengkap
- **Authentication** - Simple login system
- **Auto Triggers** - Notifikasi otomatis saat status change
- **REST API** - GET & POST endpoints
- **CORS Enabled** - Siap untuk web app
- **Error Handling** - Comprehensive error messages

### 📊 Database Tables (Google Sheets):

1. **ServiceUsers** - Data pengajuan
2. **Documents** - Metadata dokumen (file di Drive)
3. **Notifications** - Sistem notifikasi
4. **Users** - User accounts (admin & field officer)
5. **ActivityLogs** - Audit trail semua aktivitas

---

## 🔌 API Endpoints

### Service Users
```
GET  /exec?action=getServiceUsers&apiKey=xxx
GET  /exec?action=getServiceUserById&id=xxx&apiKey=xxx
POST /exec?action=createServiceUser&apiKey=xxx
POST /exec?action=updateServiceUserStatus&apiKey=xxx
GET  /exec?action=deleteServiceUser&id=xxx&apiKey=xxx
```

### Documents
```
POST /exec?action=uploadDocument&apiKey=xxx
GET  /exec?action=getDocuments&serviceUserId=xxx&apiKey=xxx
GET  /exec?action=deleteDocument&id=xxx&apiKey=xxx
```

### Notifications
```
GET  /exec?action=getNotifications&userId=xxx&apiKey=xxx
GET  /exec?action=markNotificationAsRead&id=xxx&apiKey=xxx
POST /exec?action=createNotification&apiKey=xxx
```

### Users
```
POST /exec?action=login&apiKey=xxx
GET  /exec?action=getUser&id=xxx&apiKey=xxx
```

---

## 💡 Contoh Penggunaan

### Frontend - Create Service User

```typescript
import { api } from './lib/api';

// Create new service user with documents
const result = await api.createServiceUser({
  nama: 'John Doe',
  nik: '1234567890123456',
  alamat: 'Jakarta',
  jenisLayanan: 'Pemeriksaan Jenazah',
  documents: [
    {
      type: 'KTP',
      imageUrl: 'data:image/jpeg;base64,...',
      ocrText: 'NIK: 1234567890123456...',
      ocrData: {
        nik: '1234567890123456',
        nama: 'John Doe'
      }
    }
  ]
});

console.log('Created:', result);
```

### Frontend - Update Status

```typescript
// Admin verify user
await api.updateServiceUserStatus(
  'user-id',
  'verified',
  'Dokumen lengkap dan valid'
);

// Show toast
toast.success('Status berhasil diupdate!');
```

### Frontend - Upload Document with OCR

```typescript
// Upload document to Google Drive
const doc = await api.uploadDocument({
  serviceUserId: 'user-id',
  type: 'KTP',
  imageUrl: base64Image,
  ocrText: ocrResult.text,
  ocrData: {
    nik: extractedNIK,
    nama: extractedName
  }
});

console.log('Uploaded to Drive:', doc.fileUrl);
```

---

## 🔐 Security

### API Key Authentication
Setiap request harus include API key:
```
?apiKey=your-secret-api-key
```

### Best Practices:
1. ✅ Ganti default API key dengan random string
2. ✅ Simpan API key di .env (tidak commit ke Git)
3. ✅ Ganti password admin default
4. ✅ Enable 2FA di Google Account
5. ✅ Restrict Apps Script access jika perlu

---

## 📈 Limits & Quotas

### Google Apps Script Free Tier:

| Resource | Limit |
|----------|-------|
| **URL Fetch calls** | 20,000/day |
| **Script runtime** | 6 min/execution |
| **Triggers** | 20/user |
| **Storage (Drive)** | 15 GB (free) |
| **Sheet cells** | 10 million |

### Tips Optimasi:
- Cache di frontend untuk reduce API calls
- Batch operations untuk bulk updates
- Pagination untuk large datasets
- Compress images sebelum upload

---

## 🧪 Testing

### Test via Browser
```
https://script.google.com/.../exec?action=getServiceUsers&apiKey=xxx
```

### Test via Postman
```http
POST https://script.google.com/.../exec?action=login&apiKey=xxx
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Test via Apps Script
```javascript
// Run function: testApi
function testApi() {
  const result = createServiceUser({...});
  Logger.log(result);
}
```

---

## 🔄 Deployment & Updates

### Initial Deploy:
1. Apps Script > Deploy > New deployment
2. Type: Web app
3. Who has access: **Anyone**
4. Copy URL

### Update Backend:
1. Edit kode
2. Save
3. Deploy > Manage deployments > Edit
4. New version
5. Deploy

> URL tetap sama! Frontend tidak perlu update.

---

## 📊 Monitoring

### View Logs:
- Apps Script > Executions (sidebar)
- See all API calls, errors, performance

### View Data:
- Open Google Sheet
- Check each tab untuk data real-time

### Activity Logs:
- Tab ActivityLogs di Sheet
- Track semua user activities

---

## 🆚 Perbandingan

| Fitur | Google Apps Script | Supabase |
|-------|-------------------|----------|
| **Harga** | ✅ 100% Gratis | Free tier terbatas |
| **Setup** | ✅ Mudah (5 menit) | Moderate |
| **Scalability** | 20k calls/day | Unlimited (paid) |
| **Real-time** | Polling | ✅ WebSocket |
| **Storage** | Google Drive | ✅ S3-compatible |
| **Database** | Sheets | ✅ PostgreSQL |
| **Best for** | Small-Medium apps | Production apps |

---

## 🐛 Common Issues

### "Missing action parameter"
✅ Solution: Pastikan `?action=xxx` ada di URL

### "Unauthorized: Invalid API key"
✅ Solution: Check API_KEY di Apps Script dan .env sama

### "Spreadsheet not found"
✅ Solution: Check SPREADSHEET_ID benar

### CORS error
✅ Solution: Deploy dengan "Who has access: Anyone"

### Script timeout
✅ Solution: Optimize code, reduce operations per call

---

## 📚 Dokumentasi Lengkap

- **[GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)** - Setup guide detail
- **[DATACONTEXT_API_EXAMPLES.tsx](./DATACONTEXT_API_EXAMPLES.tsx)** - Code examples
- **[google-apps-script-backend.js](./google-apps-script-backend.js)** - Backend source

---

## ✅ Checklist

Setup Backend:
- [ ] Google Sheet dibuat
- [ ] Google Drive folder dibuat
- [ ] Kode backend di-paste ke Apps Script
- [ ] SPREADSHEET_ID, DRIVE_FOLDER_ID, API_KEY diganti
- [ ] setupDatabase() dijalankan
- [ ] Deploy as Web App berhasil
- [ ] Web App URL di-copy

Setup Frontend:
- [ ] api.ts di-copy ke src/lib/api.ts
- [ ] .env updated (VITE_API_URL, VITE_API_KEY)
- [ ] DataContext updated dengan API calls
- [ ] Test create service user berhasil
- [ ] Test upload document berhasil

---

## 🎉 Selesai!

Backend Google Apps Script siap digunakan!

**Keuntungan:**
- ✅ **Gratis selamanya** untuk 20k requests/day
- ✅ **No server management** - Google yang handle
- ✅ **Built-in integrations** - Sheets, Drive, Gmail, Calendar
- ✅ **Easy to maintain** - Update langsung di browser
- ✅ **Perfect untuk MVP** dan small-medium apps

**Next Steps:**
1. Test semua fitur
2. Ganti admin password
3. Add more users
4. Deploy frontend
5. Share dengan team!

---

**Happy Coding! 🚀**

Questions? Check:
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)
