# 🏗️ ARSITEKTUR INTEGRASI - FIELD-TO-OFFICE SYNC

## 📐 DIAGRAM ALUR DATA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React App)                         │
│                    http://localhost:5173                             │
└───────────────────────────┬─────────────────────────────────────────┘
                            │
                            │ HTTP Request
                            │ (with API_KEY)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    GOOGLE APPS SCRIPT API                            │
│        https://script.google.com/macros/s/.../exec                   │
│                                                                       │
│  Endpoints:                                                           │
│  • createServiceUser()    → Simpan data ke sheet                     │
│  • uploadDocument()       → Upload file ke Drive                     │
│  • updateServiceUserStatus() → Update status di sheet                │
│  • getServiceUsers()      → Ambil data dari sheet                    │
│  • getNotifications()     → Ambil notifikasi                         │
└───────────┬───────────────────────────┬─────────────────────────────┘
            │                           │
            │                           │
            ▼                           ▼
┌─────────────────────────┐  ┌─────────────────────────────┐
│   GOOGLE SHEETS DB      │  │   GOOGLE DRIVE STORAGE      │
│                         │  │                              │
│  Sheets:                │  │  Folder:                     │
│  • ServiceUsers         │  │  "Field-to-Office Documents" │
│  • Documents            │  │                              │
│  • Notifications        │  │  Files:                      │
│  • Users                │  │  • KTP_xxx.jpg               │
│  • ActivityLogs         │  │  • KK_xxx.jpg                │
└─────────────────────────┘  │  • NPWP_xxx.jpg              │
                             └─────────────────────────────┘
```

---

## 🔄 FLOW PROSES BISNIS

### 1️⃣ PETUGAS INPUT DATA

```
[Petugas Lapangan]
       │
       │ 1. Login dengan kredensial
       ▼
[Field Officer Dashboard]
       │
       │ 2. Buka form data collection
       ▼
[Data Collection Form]
       │
       │ 3. Isi data:
       │    - Nama, NIK, Alamat
       │    - No. Telepon, Email
       │    - Jenis Layanan, Keterangan
       │
       │ 4. Upload dokumen (Kamera/File)
       │    - KTP, KK, NPWP, dll
       │
       │ 5. (Opsional) OCR auto-extract data
       │
       │ 6. Submit form
       ▼
[Frontend API Call]
       │
       │ POST /createServiceUser
       │ Body: { nama, nik, alamat, ... documents }
       ▼
[Google Apps Script]
       │
       ├──► 7a. Simpan data ke sheet "ServiceUsers"
       │         - Generate unique ID
       │         - Set status: pending
       │         - Timestamp: createdAt
       │
       ├──► 7b. Upload dokumen ke Google Drive
       │         - Convert base64 → file
       │         - Save to folder
       │         - Get file URL
       │
       ├──► 7c. Simpan metadata dokumen ke sheet "Documents"
       │         - Link ke serviceUserId
       │         - Simpan OCR data
       │
       └──► 7d. Buat notifikasi untuk Admin
                 - Sheet "Notifications"
                 - Message: "Pengajuan baru dari [nama]"
```

**HASIL:**
- ✅ Data tersimpan di Google Sheets
- ✅ File tersimpan di Google Drive
- ✅ Admin dapat notifikasi

---

### 2️⃣ ADMIN VERIFIKASI DATA

```
[Admin]
       │
       │ 1. Login dengan kredensial admin
       ▼
[Admin Dashboard]
       │
       │ 2. Lihat daftar pengajuan (tab: Menunggu)
       │    - Real-time sync dari Google Sheets
       │
       │ 3. Klik pada data untuk review
       ▼
[Dialog Detail & Verifikasi]
       │
       │ 4. Review data:
       │    - Info pribadi (nama, NIK, dll)
       │    - Dokumen terlampir (preview gambar)
       │    - OCR data (jika ada)
       │
       │ 5. Pilih status:
       │    □ Terverifikasi (hijau)
       │    □ Tidak Lengkap (kuning)
       │    □ Ditolak (merah)
       │
       │ 6. Tulis catatan untuk petugas
       │
       │ 7. Klik "Kirim Verifikasi"
       ▼
[Frontend API Call]
       │
       │ POST /updateServiceUserStatus
       │ Body: { id, status, statusMessage }
       ▼
[Google Apps Script]
       │
       ├──► 8a. Update status di sheet "ServiceUsers"
       │         - status: verified/rejected/incomplete
       │         - statusMessage: catatan admin
       │         - updatedAt: timestamp
       │
       ├──► 8b. Buat notifikasi untuk Petugas
       │         - Sheet "Notifications"
       │         - Message: "Status [nama] diubah menjadi [status]"
       │
       └──► 8c. Log aktivitas
                 - Sheet "ActivityLogs"
                 - Action: UPDATE_STATUS
```

**HASIL:**
- ✅ Status terupdate di Google Sheets
- ✅ Petugas dapat notifikasi
- ✅ Aktivitas tercatat di logs

---

### 3️⃣ PETUGAS CEK STATUS

```
[Petugas Lapangan]
       │
       │ 1. Login ke dashboard
       ▼
[Field Officer Dashboard]
       │
       │ 2. Lihat daftar pengajuan (My Submissions)
       │    - Data dari Google Sheets filtered by petugas
       │
       │ 3. Lihat notifikasi (badge merah jika ada update)
       ▼
[Status Info]
       │
       │ Status: Terverifikasi ✅
       │ atau
       │ Status: Tidak Lengkap ⚠️
       │ Pesan Admin: "Mohon upload KTP yang lebih jelas"
       │
       │ 4. (Jika perlu) Upload dokumen tambahan
       │    → Loop kembali ke Flow #1
```

---

## 🗄️ STRUKTUR DATABASE DETAIL

### Sheet: **ServiceUsers**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique ID (UUID) | `f47ac10b-58cc-4372-a567-0e02b2c3d479` |
| `nama` | String | Nama lengkap | `Budi Santoso` |
| `nik` | String | Nomor Induk Kependudukan | `3571234567890001` |
| `alamat` | String | Alamat lengkap | `Jl. Merdeka No. 123, Kupang` |
| `noTelepon` | String | Nomor telepon | `081234567890` |
| `email` | String | Email | `budi@example.com` |
| `jenisLayanan` | String | Jenis layanan | `Karantina Hewan` |
| `keterangan` | String | Keterangan tambahan | `Ekspor ternak ke Timor Leste` |
| `status` | Enum | Status verifikasi | `pending` / `verified` / `rejected` / `incomplete` |
| `statusMessage` | String | Pesan dari admin | `Dokumen sudah lengkap` |
| `fieldOfficerId` | String | ID petugas | `user-abc123` |
| `fieldOfficerName` | String | Nama petugas | `Ahmad Fauzi` |
| `createdAt` | ISO 8601 | Timestamp dibuat | `2026-03-05T10:30:00.000Z` |
| `updatedAt` | ISO 8601 | Timestamp diupdate | `2026-03-05T15:45:00.000Z` |

### Sheet: **Documents**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique ID | `doc-xyz789` |
| `serviceUserId` | String | Foreign key → ServiceUsers | `f47ac10b-...` |
| `type` | Enum | Tipe dokumen | `KTP` / `KK` / `NPWP` / `OTHER` |
| `fileName` | String | Nama file | `KTP_1234567890.jpg` |
| `fileId` | String | Google Drive file ID | `1AbCdEf...` |
| `fileUrl` | String | URL akses file | `https://drive.google.com/file/d/...` |
| `ocrText` | Text | Raw text dari OCR | `NIK: 3571234567890001\nNama: BUDI...` |
| `ocrData` | JSON | Structured OCR data | `{"nik": "3571...", "nama": "BUDI"}` |
| `uploadedAt` | ISO 8601 | Timestamp upload | `2026-03-05T10:35:00.000Z` |

### Sheet: **Notifications**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique ID | `notif-123` |
| `userId` | String | Target user ID | `admin-001` |
| `serviceUserId` | String | Related submission | `f47ac10b-...` |
| `userName` | String | User name | `Budi Santoso` |
| `message` | String | Notification message | `Pengajuan baru dari Budi Santoso` |
| `type` | Enum | Notification type | `new` / `status-change` / `system` |
| `read` | Boolean | Read status | `false` |
| `createdAt` | ISO 8601 | Timestamp | `2026-03-05T10:30:00.000Z` |

### Sheet: **Users**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique ID | `user-001` |
| `email` | String | Email login | `admin@test.com` |
| `password` | String | Password (plain) | `admin123` |
| `fullName` | String | Nama lengkap | `Admin Kupang` |
| `role` | Enum | User role | `admin` / `field_officer` |
| `phone` | String | Phone number | `+6281234567890` |
| `createdAt` | ISO 8601 | Timestamp dibuat | `2026-01-01T00:00:00.000Z` |
| `updatedAt` | ISO 8601 | Timestamp diupdate | `2026-03-05T10:00:00.000Z` |

### Sheet: **ActivityLogs**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | String | Unique ID | `log-456` |
| `userId` | String | Who performed action | `admin-001` |
| `action` | String | Action performed | `UPDATE_STATUS` |
| `entityType` | String | Entity type | `service_user` |
| `entityId` | String | Entity ID | `f47ac10b-...` |
| `details` | JSON | Additional details | `{"oldStatus": "pending", "newStatus": "verified"}` |
| `timestamp` | ISO 8601 | When it happened | `2026-03-05T15:45:00.000Z` |

---

## 🔐 KEAMANAN & AUTENTIKASI

```
┌──────────────────┐
│  User Login      │
│  (email + pwd)   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│  Frontend Validation         │
│  - Email format check        │
│  - Password length check     │
└────────┬─────────────────────┘
         │
         │ POST /login { email, password, apiKey }
         ▼
┌──────────────────────────────┐
│  Apps Script Auth            │
│  1. Verify apiKey            │
│  2. Check Users sheet        │
│  3. Match email + password   │
│  4. Generate session token   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Return User Object + Token  │
│  - Store in localStorage     │
│  - Store in AuthContext      │
│  - Include in future requests│
└──────────────────────────────┘
```

**Security Layers:**
1. ✅ API Key validation (Apps Script)
2. ✅ Email/password authentication (Users sheet)
3. ✅ Session token (localStorage)
4. ✅ Role-based access control (admin vs field_officer)
5. ✅ Activity logging (all actions recorded)

---

## 📡 API ENDPOINTS

### Authentication
```
POST /login
  Body: { email, password }
  Response: { success, user, token }
```

### Service Users
```
GET /getServiceUsers
  Params: ?status=pending&fieldOfficerId=xxx
  Response: { success, data: [users] }

GET /getServiceUserById
  Params: ?id=xxx
  Response: { success, data: user }

POST /createServiceUser
  Body: { data: { nama, nik, ... } }
  Response: { success, data: createdUser }

POST /updateServiceUserStatus
  Body: { id, status, statusMessage }
  Response: { success, data: updatedUser }

GET /deleteServiceUser
  Params: ?id=xxx
  Response: { success, message }
```

### Documents
```
POST /uploadDocument
  Body: { data: { serviceUserId, type, imageUrl, ocrData } }
  Response: { success, data: document }

GET /getDocuments
  Params: ?serviceUserId=xxx
  Response: { success, data: [documents] }

GET /deleteDocument
  Params: ?id=xxx
  Response: { success, message }
```

### Notifications
```
GET /getNotifications
  Params: ?userId=xxx&unreadOnly=true
  Response: { success, data: [notifications] }

POST /createNotification
  Body: { data: { userId, message, type } }
  Response: { success, data: notification }

GET /markNotificationAsRead
  Params: ?id=xxx
  Response: { success, message }
```

---

## 🎯 KEUNGGULAN ARSITEKTUR INI

### ✅ **TANPA SERVER BACKEND**
- Tidak perlu setup Node.js server
- Tidak perlu hosting backend
- Google Apps Script = serverless backend gratis

### ✅ **TANPA DATABASE SETUP**
- Tidak perlu install PostgreSQL/MySQL
- Google Sheets = database yang mudah dipahami
- Bisa diedit manual jika perlu

### ✅ **TANPA FILE STORAGE SETUP**
- Tidak perlu setup S3/MinIO
- Google Drive = unlimited storage (per akun)
- File bisa diakses langsung via link

### ✅ **REAL-TIME SYNC**
- Data langsung tersimpan di cloud
- Multiple user bisa akses bersamaan
- Tidak ada lag/delay

### ✅ **MUDAH DI-MAINTAIN**
- Admin bisa lihat/edit data langsung di Google Sheets
- Debug mudah: cek sheet langsung
- Backup mudah: export sheet ke Excel

### ✅ **SCALABLE**
- Google Sheets: support 10 juta cells
- Google Drive: 15GB free per akun
- Apps Script: 6 menit execution time per request

---

## 📊 MONITORING & MAINTENANCE

### Daily Tasks:
- ✅ Cek sheet "ServiceUsers" untuk pengajuan baru
- ✅ Cek sheet "Notifications" untuk notif pending

### Weekly Tasks:
- ✅ Review sheet "ActivityLogs" untuk audit
- ✅ Backup Google Sheet (File → Download → Excel)
- ✅ Check Google Drive storage usage

### Monthly Tasks:
- ✅ Clean up old files di Google Drive
- ✅ Archive old data (move to separate sheet)
- ✅ Review & update API_KEY untuk keamanan

---

**📖 Referensi:**
- API Documentation: `/google-apps-script-backend.js`
- Setup Guide: `/PANDUAN_SETUP_LENGKAP.md`
- Quick Checklist: `/CHECKLIST_SETUP.md`
