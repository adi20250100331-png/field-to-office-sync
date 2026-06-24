# 🧪 Testing Google Sheets API

Panduan untuk testing integrasi Google Sheets API.

---

## 🎯 Quick Test

### Test di Browser

```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec?action=getServiceUsers&apiKey=[API_KEY]
```

**Expected Response:**
```json
{
  "success": true,
  "data": [],
  "timestamp": "2026-03-05T..."
}
```

---

## 🔍 Test via Browser Console

### 1. Quick Connection Test

```javascript
// Paste di browser console
await window.googleSheetsTest.quickTest()
```

**Output:**
```
⚡ Quick Test
Configured: true
✅ API is working!
Service Users count: 0
```

### 2. Full Test Suite

```javascript
// Run all tests
await window.googleSheetsTest.runAllTests()
```

**Output:**
```
🚀 Starting Google Sheets API Tests...

🔧 Test 1: Configuration
✅ Configuration valid

🌐 Test 2: Connection
✅ Connection successful

📋 Test 3: Get Service Users
✅ Get service users successful

➕ Test 4: Create Service User
✅ Create service user successful

📝 Test 5: Update Status
✅ Update status successful

📄 Test 6: Upload Document
✅ Upload document successful

🔔 Test 7: Get Notifications
✅ Get notifications successful

📊 Test Results Summary:
┌─────────────────┬────────┐
│ Test            │ Result │
├─────────────────┼────────┤
│ configuration   │ true   │
│ connection      │ true   │
│ getUsers        │ true   │
│ createUser      │ true   │
│ updateStatus    │ true   │
│ uploadDocument  │ true   │
│ getNotifications│ true   │
└─────────────────┴────────┘

7/7 tests passed
✅ All tests passed! Google Sheets API is working correctly.
```

### 3. Individual Tests

```javascript
// Test configuration
await window.googleSheetsTest.testConfiguration()

// Test connection only
await window.googleSheetsTest.testConnection()

// Test get users
await window.googleSheetsTest.testGetServiceUsers()

// Test create user
const userId = await window.googleSheetsTest.testCreateServiceUser()

// Test update status
await window.googleSheetsTest.testUpdateStatus(userId)

// Test upload document
await window.googleSheetsTest.testUploadDocument(userId)

// Test notifications
await window.googleSheetsTest.testGetNotifications()
```

---

## 🛠️ Test via Postman

### Setup Collection

1. Create new Collection: "Field-to-Office API"
2. Set Collection Variable:
   - `baseUrl`: `https://script.google.com/macros/s/[ID]/exec`
   - `apiKey`: `your-api-key-here`

### Test Requests

#### 1. Get All Service Users

```http
GET {{baseUrl}}?action=getServiceUsers&apiKey={{apiKey}}
```

#### 2. Get User by ID

```http
GET {{baseUrl}}?action=getServiceUserById&id=user-123&apiKey={{apiKey}}
```

#### 3. Create Service User

```http
POST {{baseUrl}}?action=createServiceUser&apiKey={{apiKey}}
Content-Type: application/json

{
  "data": {
    "nama": "Test User from Postman",
    "nik": "1234567890123456",
    "alamat": "Jakarta Selatan",
    "noTelepon": "081234567890",
    "email": "test@example.com",
    "jenisLayanan": "Pemeriksaan Jenazah",
    "keterangan": "Test API via Postman",
    "fieldOfficerId": "test-officer-123",
    "fieldOfficerName": "Test Officer"
  }
}
```

#### 4. Update Status

```http
POST {{baseUrl}}?action=updateServiceUserStatus&apiKey={{apiKey}}
Content-Type: application/json

{
  "id": "user-123",
  "status": "verified",
  "statusMessage": "Dokumen lengkap dan valid"
}
```

#### 5. Upload Document

```http
POST {{baseUrl}}?action=uploadDocument&apiKey={{apiKey}}
Content-Type: application/json

{
  "data": {
    "serviceUserId": "user-123",
    "type": "KTP",
    "imageUrl": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAA...",
    "ocrText": "NIK: 1234567890123456\nNama: TEST USER",
    "ocrData": {
      "nik": "1234567890123456",
      "nama": "TEST USER"
    }
  }
}
```

#### 6. Get Notifications

```http
GET {{baseUrl}}?action=getNotifications&userId=user-123&apiKey={{apiKey}}
```

#### 7. Login

```http
POST {{baseUrl}}?action=login&apiKey={{apiKey}}
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```

---

## 📱 Test via cURL

### Get Service Users
```bash
curl "https://script.google.com/macros/s/[ID]/exec?action=getServiceUsers&apiKey=[KEY]"
```

### Create Service User
```bash
curl -X POST "https://script.google.com/macros/s/[ID]/exec?action=createServiceUser&apiKey=[KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "nama": "Test User",
      "nik": "1234567890123456",
      "alamat": "Jakarta",
      "noTelepon": "081234567890",
      "email": "test@example.com",
      "jenisLayanan": "Test Service",
      "keterangan": "Test",
      "fieldOfficerId": "test-123",
      "fieldOfficerName": "Test Officer"
    }
  }'
```

### Update Status
```bash
curl -X POST "https://script.google.com/macros/s/[ID]/exec?action=updateServiceUserStatus&apiKey=[KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "user-123",
    "status": "verified",
    "statusMessage": "OK"
  }'
```

---

## 🔬 Test in Application

### 1. Login & Create User

1. Login sebagai field officer (username: `adhy`, password: `adhy123`)
2. Klik "Buat Pengajuan Baru"
3. Isi form dan submit
4. Check browser console untuk API calls
5. Check Google Sheets → data muncul di `ServiceUsers`

### 2. Upload Document

1. Di form, gunakan camera/upload untuk tambah dokumen
2. Submit form
3. Check Google Drive → file muncul di folder
4. Check `Documents` sheet → metadata tersimpan

### 3. Verify Data (as Admin)

1. Login sebagai admin (buat user admin dulu di sheet)
2. Lihat list pengajuan
3. Verifikasi/tolak pengajuan
4. Check `ServiceUsers` sheet → status berubah
5. Check `Notifications` sheet → notifikasi dibuat

---

## 📊 Validation Checklist

### ✅ Configuration
- [ ] `.env` file exists
- [ ] `VITE_API_URL` is set
- [ ] `VITE_API_KEY` is set
- [ ] Values match Apps Script config

### ✅ Backend
- [ ] Apps Script deployed
- [ ] `setupDatabase()` run successfully
- [ ] 5 sheets created in Google Sheet
- [ ] Admin user exists in `Users` sheet
- [ ] Deployment URL accessible

### ✅ API Endpoints
- [ ] `getServiceUsers` works
- [ ] `getServiceUserById` works
- [ ] `createServiceUser` works
- [ ] `updateServiceUserStatus` works
- [ ] `deleteServiceUser` works
- [ ] `uploadDocument` works
- [ ] `getDocuments` works
- [ ] `getNotifications` works
- [ ] `markNotificationAsRead` works
- [ ] `login` works

### ✅ Data Flow
- [ ] Create user → data in Sheet
- [ ] Upload doc → file in Drive
- [ ] Update status → Sheet updated
- [ ] Status change → notification created
- [ ] All timestamps correct (ISO format)

### ✅ Frontend
- [ ] `useData` hook works
- [ ] `addServiceUser` saves to API
- [ ] `updateServiceUserStatus` updates API
- [ ] Loading states work
- [ ] Error handling works
- [ ] Toast notifications appear

---

## 🐛 Debug Checklist

### Issue: "API not configured"

```javascript
// Check config
import { getApiConfig } from '@/lib/api'
console.log(getApiConfig())

// Should show:
// {
//   url: "https://script.google.com/...",
//   hasKey: true,
//   isConfigured: true
// }
```

**Fix:**
- Create `.env` file
- Add `VITE_API_URL` and `VITE_API_KEY`
- Restart dev server

### Issue: "Connection failed"

```javascript
// Test connection
import GoogleSheetsService from '@/lib/google-sheets.service'
await GoogleSheetsService.checkConnection()
```

**Fix:**
- Check API URL is correct (copy from Apps Script deployment)
- Check API Key matches (case-sensitive)
- Test URL in browser directly
- Check browser console for CORS errors

### Issue: "Unauthorized"

**Fix:**
- API_KEY in `.env` must match API_KEY in Apps Script
- Both are case-sensitive
- No extra spaces

### Issue: CORS Error

**Fix:**
- Deploy Apps Script with "Who has access: **Anyone**"
- Not "Only myself"
- Redeploy if needed

### Issue: Data not saving

```javascript
// Check API calls in Network tab
// Filter: /exec

// Check response
console.log(await api.createServiceUser({...}))

// Should return created user object
```

**Fix:**
- Check Network tab for actual error
- Check Apps Script execution logs
- Check Sheet permissions
- Check Drive folder permissions

---

## 📈 Performance Testing

### Response Time

```javascript
// Measure API response time
console.time('API Call')
await api.getServiceUsers()
console.timeEnd('API Call')

// Expected: < 2 seconds for empty data
// Expected: < 5 seconds for 100 users
```

### Concurrent Requests

```javascript
// Test multiple requests
const promises = [
  api.getServiceUsers(),
  api.getNotifications('user-123'),
  api.getServiceUserById('user-123')
]

console.time('Concurrent')
await Promise.all(promises)
console.timeEnd('Concurrent')

// Should complete successfully
```

### Large Dataset

```javascript
// Create multiple users
for (let i = 0; i < 10; i++) {
  await api.createServiceUser({
    nama: `Test User ${i}`,
    nik: `123456789012345${i}`,
    // ... other fields
  })
}

// Check performance
console.time('Get All')
const users = await api.getServiceUsers()
console.timeEnd('Get All')

console.log(`Loaded ${users.length} users`)
```

---

## 📝 Test Report Template

```markdown
## API Test Report

**Date:** 2026-03-05
**Tester:** [Your Name]

### Environment
- API URL: https://script.google.com/macros/s/[ID]/exec
- Frontend: http://localhost:3000
- Browser: Chrome 120

### Test Results

| Test | Status | Notes |
|------|--------|-------|
| Configuration | ✅ PASS | .env configured correctly |
| Connection | ✅ PASS | API responding |
| Get Users | ✅ PASS | Returns array |
| Create User | ✅ PASS | Data saved to Sheet |
| Update Status | ✅ PASS | Status changed |
| Upload Doc | ✅ PASS | File in Drive |
| Notifications | ✅ PASS | Working |

### Issues Found
- None

### Performance
- Get Users: 1.2s
- Create User: 2.5s
- Upload Doc: 3.8s

### Recommendation
✅ Ready for production
```

---

## 🎯 Production Readiness

Before going live:

- [ ] All API tests pass
- [ ] Error handling tested
- [ ] Loading states work
- [ ] Toast notifications work
- [ ] Data persists correctly
- [ ] Backup created
- [ ] Admin password changed
- [ ] API key is secure (20+ chars)
- [ ] Documentation reviewed
- [ ] Team trained

---

**Test completed? Check [GOOGLE_SHEETS_INTEGRATION.md](./GOOGLE_SHEETS_INTEGRATION.md) for next steps!**
