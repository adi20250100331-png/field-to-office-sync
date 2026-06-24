# 📝 Google Apps Script Backend - Setup Guide

Panduan lengkap untuk setup backend menggunakan Google Apps Script.

---

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Setup Google Sheets](#setup-google-sheets)
3. [Setup Google Drive](#setup-google-drive)
4. [Deploy Apps Script](#deploy-apps-script)
5. [Konfigurasi Frontend](#konfigurasi-frontend)
6. [Testing API](#testing-api)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Persiapan

### Yang Dibutuhkan:
- ✅ Google Account
- ✅ Google Sheets (sebagai database)
- ✅ Google Drive (untuk storage dokumen)
- ✅ Google Apps Script

### Keuntungan Google Apps Script:
- ✅ **100% GRATIS** - Tidak ada biaya
- ✅ **Mudah setup** - Tidak perlu server
- ✅ **Otomatis scale** - Google yang handle
- ✅ **Terintegrasi** - Sheets, Drive, Gmail, dll
- ✅ **REST API** - Bisa diakses dari frontend

---

## 📊 Setup Google Sheets

### 1. Buat Google Sheets Baru

1. Buka [sheets.google.com](https://sheets.google.com)
2. Klik **Blank** (lembar kosong)
3. Rename sheet menjadi: **"Field-to-Office DB"**
4. Copy **Spreadsheet ID** dari URL:
   ```
   https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
   ```

### 2. Sheet Structure

Script akan otomatis membuat sheets berikut:
- **ServiceUsers** - Data pengajuan
- **Documents** - Metadata dokumen
- **Notifications** - Notifikasi sistem
- **Users** - User accounts
- **ActivityLogs** - Audit trail

> ⚠️ **Jangan rename atau delete sheets ini setelah dibuat!**

---

## 💾 Setup Google Drive

### 1. Buat Folder untuk Dokumen

1. Buka [drive.google.com](https://drive.google.com)
2. Klik **New** > **Folder**
3. Nama folder: **"Field-to-Office Documents"**
4. Klik kanan folder > **Share**
5. Set permission: **Anyone with the link can view**
6. Copy **Folder ID** dari URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```

### 2. Struktur Folder (Opsional)

Folder akan otomatis terisi dengan struktur:
```
Field-to-Office Documents/
├── KTP_1234567890123456.jpg
├── KK_9876543210987654.jpg
└── NPWP_5555555555555555.jpg
```

---

## ⚙️ Deploy Apps Script

### Step 1: Buka Apps Script Editor

1. Buka Google Sheet yang sudah dibuat
2. Menu: **Extensions** > **Apps Script**
3. Delete kode default (`function myFunction() {}`)

### Step 2: Copy Paste Kode Backend

1. Copy **seluruh isi** file `google-apps-script-backend.js`
2. Paste di Apps Script editor
3. **Ganti 3 nilai berikut:**

```javascript
// Line 16-17: Ganti dengan ID Anda
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';  // ← Ganti!
const DRIVE_FOLDER_ID = 'YOUR_DRIVE_FOLDER_ID_HERE'; // ← Ganti!

// Line 35: Ganti dengan API key Anda (buat sendiri, acak)
const API_KEY = 'your-secret-api-key-here'; // ← Ganti!
```

Contoh API key yang baik:
```javascript
const API_KEY = 'f2o_2026_AbCdEfGh123456_secret';
```

4. **Save project**: Ctrl+S atau icon Save
5. **Rename project**: Klik "Untitled project" → rename menjadi **"Field-to-Office Backend"**

### Step 3: Setup Database (Run Once)

1. Pilih function: **setupDatabase** (dropdown di toolbar)
2. Klik **Run** (▶️ icon)
3. First time akan minta permission:
   - Klik **Review permissions**
   - Pilih Google account Anda
   - Klik **Advanced** > **Go to Field-to-Office Backend (unsafe)**
   - Klik **Allow**
4. Tunggu sampai selesai (cek **Execution log**)
5. Refresh Google Sheets → akan muncul 5 sheets baru
6. Sheet **Users** akan punya 1 admin user:
   - Email: `admin@test.com`
   - Password: `admin123`

> ⚠️ **PENTING**: Ganti password admin setelah setup!

### Step 4: Deploy as Web App

1. Klik **Deploy** > **New deployment**
2. Klik **⚙️ icon** > Select type: **Web app**
3. Isi form:
   - **Description**: "Field-to-Office API v1"
   - **Execute as**: **Me** (your-email@gmail.com)
   - **Who has access**: **Anyone** (penting!)
4. Klik **Deploy**
5. Copy **Web app URL**:
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
   ```
6. **Save URL ini** - akan digunakan di frontend!

### Step 5: Test Deployment

1. Buka URL di browser baru:
   ```
   https://script.google.com/.../exec?action=getServiceUsers&apiKey=your-api-key
   ```
2. Harusnya dapat response JSON:
   ```json
   {
     "success": true,
     "data": [],
     "timestamp": "2026-03-04T..."
   }
   ```

---

## 💻 Konfigurasi Frontend

### 1. Update Environment Variables

**File**: `.env`

```env
# Google Apps Script Backend
VITE_API_URL=https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
VITE_API_KEY=your-secret-api-key-here

# Storage type
VITE_STORAGE_TYPE=google-apps-script
```

### 2. Create API Client

**File**: `src/lib/api.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface ApiRequest {
  action: string;
  [key: string]: any;
}

/**
 * Call Google Apps Script API
 */
export async function callApi(request: ApiRequest) {
  // Build URL for GET requests
  const isGet = request.method === 'GET' || !request.method;
  
  let url = API_URL;
  if (isGet) {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      action: request.action,
      ...request
    });
    url += '?' + params.toString();
  }
  
  const options: RequestInit = {
    method: isGet ? 'GET' : 'POST',
  };
  
  if (!isGet) {
    options.body = JSON.stringify({
      apiKey: API_KEY,
      ...request
    });
    options.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// API Methods
export const api = {
  // Service Users
  getServiceUsers: (params?: { status?: string; fieldOfficerId?: string }) =>
    callApi({ action: 'getServiceUsers', ...params }),
  
  getServiceUserById: (id: string) =>
    callApi({ action: 'getServiceUserById', id }),
  
  createServiceUser: (data: any) =>
    callApi({ action: 'createServiceUser', method: 'POST', data }),
  
  updateServiceUserStatus: (id: string, status: string, statusMessage?: string) =>
    callApi({ action: 'updateServiceUserStatus', method: 'POST', id, status, statusMessage }),
  
  deleteServiceUser: (id: string) =>
    callApi({ action: 'deleteServiceUser', id }),
  
  // Documents
  uploadDocument: (data: any) =>
    callApi({ action: 'uploadDocument', method: 'POST', data }),
  
  getDocuments: (serviceUserId?: string) =>
    callApi({ action: 'getDocuments', serviceUserId }),
  
  deleteDocument: (id: string) =>
    callApi({ action: 'deleteDocument', id }),
  
  // Notifications
  getNotifications: (userId: string, unreadOnly?: boolean) =>
    callApi({ action: 'getNotifications', userId, unreadOnly }),
  
  markNotificationAsRead: (id: string) =>
    callApi({ action: 'markNotificationAsRead', id }),
  
  createNotification: (data: any) =>
    callApi({ action: 'createNotification', method: 'POST', data }),
  
  // Users
  login: (email: string, password: string) =>
    callApi({ action: 'login', method: 'POST', email, password }),
  
  getUser: (id: string) =>
    callApi({ action: 'getUser', id }),
};
```

### 3. Update DataContext

**File**: `src/app/context/DataContext.tsx`

```typescript
import { api } from '../../lib/api';

// Replace localStorage with API calls
const addServiceUser = async (user: Omit<ServiceUser, 'id' | 'createdAt'>) => {
  try {
    const newUser = await api.createServiceUser(user);
    setServiceUsers(prev => [...prev, newUser]);
    toast.success('Data berhasil dikirim!');
  } catch (error: any) {
    toast.error('Gagal mengirim data', {
      description: error.message
    });
  }
};

const updateUserStatus = async (userId: string, status: string, message?: string) => {
  try {
    const updatedUser = await api.updateServiceUserStatus(userId, status, message);
    setServiceUsers(prev => 
      prev.map(u => u.id === userId ? updatedUser : u)
    );
    toast.success('Status berhasil diupdate');
  } catch (error: any) {
    toast.error('Gagal update status', {
      description: error.message
    });
  }
};

// Fetch data on mount
useEffect(() => {
  const fetchData = async () => {
    try {
      const users = await api.getServiceUsers();
      setServiceUsers(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };
  
  fetchData();
}, []);
```

---

## 🧪 Testing API

### Test via Browser

#### 1. Get Service Users
```
https://script.google.com/.../exec?action=getServiceUsers&apiKey=YOUR_API_KEY
```

#### 2. Get User by ID
```
https://script.google.com/.../exec?action=getServiceUserById&id=USER_ID&apiKey=YOUR_API_KEY
```

#### 3. Get Notifications
```
https://script.google.com/.../exec?action=getNotifications&userId=USER_ID&apiKey=YOUR_API_KEY
```

### Test via Postman

#### POST Create Service User

```http
POST https://script.google.com/.../exec?action=createServiceUser&apiKey=YOUR_API_KEY

Content-Type: application/json

{
  "data": {
    "nama": "Test User",
    "nik": "1234567890123456",
    "alamat": "Test Address",
    "noTelepon": "+628123456789",
    "email": "test@example.com",
    "jenisLayanan": "Test Service",
    "keterangan": "Test keterangan",
    "fieldOfficerId": "test-officer-id",
    "fieldOfficerName": "Test Officer"
  }
}
```

#### POST Login

```http
POST https://script.google.com/.../exec?action=login&apiKey=YOUR_API_KEY

Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

### Test via Apps Script

1. Di Apps Script editor, pilih function **testApi**
2. Klik **Run**
3. Check **Execution log** untuk hasil

---

## 📊 Monitoring

### View Execution Logs

1. Apps Script editor > **Executions** (sidebar)
2. Lihat semua API calls
3. Check errors dan performance

### View Activity Logs

1. Buka Google Sheet
2. Tab **ActivityLogs**
3. Lihat semua aktivitas user

### View Data

- **ServiceUsers**: Semua pengajuan
- **Documents**: Metadata dokumen
- **Notifications**: Notifikasi
- **Users**: User accounts

---

## 🔐 Security Best Practices

### 1. Ganti API Key

Jangan gunakan API key default:

```javascript
// JANGAN ini:
const API_KEY = 'your-secret-api-key-here';

// GUNAKAN ini (random, panjang):
const API_KEY = 'f2o_prod_2026_kJ8mN4pQ9rT2vX5yZ7aB3cD6eF1gH';
```

Generate random key:
```javascript
function generateApiKey() {
  return 'f2o_' + Utilities.getUuid().replace(/-/g, '');
}
```

### 2. Ganti Admin Password

1. Buka Sheet **Users**
2. Edit password admin
3. Gunakan password yang kuat

### 3. Enable 2FA

Enable 2-Factor Authentication untuk Google Account Anda.

### 4. Restrict Access (Opsional)

Jika hanya untuk internal:

1. **Deploy** > **Manage deployments**
2. Edit deployment
3. **Who has access**: **Only myself** atau **Domain users**

---

## 🚀 Update & Maintenance

### Update Kode Backend

1. Edit kode di Apps Script
2. **Save** (Ctrl+S)
3. **Deploy** > **Manage deployments**
4. Klik **✏️ Edit** (deployment yang aktif)
5. **Version**: New version
6. **Deploy**

> ⚠️ URL tidak berubah, frontend tidak perlu update!

### Backup Data

#### Manual Backup:
1. Buka Google Sheet
2. **File** > **Download** > **Microsoft Excel (.xlsx)**
3. Save ke komputer

#### Automatic Backup:
```javascript
function backupDatabase() {
  const ss = getSpreadsheet();
  const destFolder = DriveApp.getFolderById('BACKUP_FOLDER_ID');
  const timestamp = Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmmss');
  const backup = ss.copy('Backup_' + timestamp);
  DriveApp.getFileById(backup.getId()).moveTo(destFolder);
}

// Run daily
function setupDailyBackup() {
  ScriptApp.newTrigger('backupDatabase')
    .timeBased()
    .everyDays(1)
    .atHour(2) // 2 AM
    .create();
}
```

---

## 🐛 Troubleshooting

### Issue: "Missing action parameter"

**Solusi**: Pastikan parameter `action` dan `apiKey` ada di request.

```javascript
// ✅ Benar
?action=getServiceUsers&apiKey=xxx

// ❌ Salah
?apiKey=xxx (action hilang)
```

### Issue: "Unauthorized: Invalid API key"

**Solusi**:
1. Check API_KEY di Apps Script
2. Check .env di frontend
3. Pastikan sama persis (case-sensitive)

### Issue: "Spreadsheet not found"

**Solusi**:
1. Check SPREADSHEET_ID di Apps Script
2. Pastikan sheet masih ada dan tidak dihapus
3. Check permission (script punya akses ke sheet)

### Issue: "Drive folder not found"

**Solusi**:
1. Check DRIVE_FOLDER_ID di Apps Script
2. Pastikan folder masih ada
3. Check permission

### Issue: CORS Error

**Solusi**: Google Apps Script otomatis handle CORS. Tapi pastikan:
1. Deploy dengan **Who has access**: **Anyone**
2. Jangan gunakan `localhost` untuk test (gunakan ngrok)

### Issue: Script timeout

**Solusi**:
- Apps Script punya limit 6 menit per execution
- Untuk bulk operations, gunakan batch processing
- Split large operations menjadi beberapa request

### Issue: Quota exceeded

**Solusi**:
Google Apps Script quotas:
- **URL Fetch calls**: 20,000/day
- **Script runtime**: 6 hours/day
- **Triggers**: 20/user

Untuk production besar, consider:
- Caching
- Rate limiting
- Upgrade ke Google Workspace

---

## 📈 Performance Tips

### 1. Batch Operations

```javascript
// ❌ Lambat (multiple API calls)
for (let user of users) {
  await api.updateUser(user.id);
}

// ✅ Cepat (single batch call)
await api.batchUpdateUsers(users);
```

### 2. Caching

```javascript
// Cache di frontend
const [cache, setCache] = useState({});

const getUsers = async () => {
  if (cache.users && Date.now() - cache.usersTime < 60000) {
    return cache.users; // Use cache if < 1 min old
  }
  
  const users = await api.getServiceUsers();
  setCache({ ...cache, users, usersTime: Date.now() });
  return users;
};
```

### 3. Pagination

```javascript
// Untuk data besar, implement pagination
const getServiceUsers = (page = 1, limit = 50) => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return allUsers.slice(start, end);
};
```

---

## 📞 Support

Jika ada masalah:

1. Check **Execution log** di Apps Script
2. Check **Browser console** untuk frontend errors
3. Review documentation ini
4. Test dengan Postman untuk isolate masalah

---

## ✅ Checklist Setup

- [ ] Google Sheet dibuat dan ID dicopy
- [ ] Google Drive folder dibuat dan ID dicopy
- [ ] Apps Script kode di-paste
- [ ] SPREADSHEET_ID, DRIVE_FOLDER_ID, API_KEY diganti
- [ ] Function setupDatabase dijalankan
- [ ] Sheets otomatis terbuat (5 sheets)
- [ ] Admin user terbuat (email: admin@test.com)
- [ ] Deploy as Web App berhasil
- [ ] Web App URL dicopy
- [ ] Test API via browser berhasil
- [ ] Frontend .env updated dengan API_URL dan API_KEY
- [ ] API client (api.ts) dibuat
- [ ] DataContext updated untuk gunakan API
- [ ] Test create service user berhasil
- [ ] Test upload document berhasil
- [ ] Admin password diganti

---

**Setup Complete! 🎉**

Backend siap digunakan dengan Google Apps Script!
