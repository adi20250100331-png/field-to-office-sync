# 🚀 Quick Reference - Google Sheets API

Cheat sheet untuk developer. Simpan & bookmark!

---

## 📌 Environment Variables

```env
VITE_API_URL=https://script.google.com/macros/s/[ID]/exec
VITE_API_KEY=your-api-key-here
```

---

## 🔧 API Client Usage

### Import

```typescript
import api from '@/lib/api'
import GoogleSheetsService from '@/lib/google-sheets.service'
```

### Service Users

```typescript
// Get all
const users = await api.getServiceUsers()

// Filter by status
const pending = await api.getServiceUsers({ status: 'pending' })

// Filter by field officer
const myUsers = await api.getServiceUsers({ 
  fieldOfficerId: user.id 
})

// Get by ID
const user = await api.getServiceUserById('user-123')

// Create
const newUser = await api.createServiceUser({
  nama: 'John Doe',
  nik: '1234567890123456',
  alamat: 'Jakarta',
  noTelepon: '081234567890',
  email: 'john@example.com',
  jenisLayanan: 'Pemeriksaan Jenazah',
  keterangan: 'Notes',
  fieldOfficerId: 'officer-123',
  fieldOfficerName: 'Officer Name'
})

// Update status
const updated = await api.updateServiceUserStatus(
  'user-123',
  'verified',
  'Dokumen lengkap'
)

// Delete
await api.deleteServiceUser('user-123')
```

### Documents

```typescript
// Upload
const doc = await api.uploadDocument({
  serviceUserId: 'user-123',
  type: 'KTP',
  imageUrl: 'data:image/jpeg;base64,...',
  ocrText: 'OCR text result',
  ocrData: {
    nik: '1234567890123456',
    nama: 'JOHN DOE'
  }
})

// Get all for user
const docs = await api.getDocuments('user-123')

// Delete
await api.deleteDocument('doc-123')
```

### Notifications

```typescript
// Get all for user
const notifications = await api.getNotifications('user-123')

// Get unread only
const unread = await api.getNotifications('user-123', true)

// Mark as read
await api.markNotificationAsRead('notif-123')

// Create
await api.createNotification({
  userId: 'user-123',
  message: 'New update available',
  type: 'system'
})
```

---

## 🎯 DataContext Usage

```typescript
import { useData } from '@/context/DataContext'

function MyComponent() {
  const {
    serviceUsers,      // ServiceUser[]
    notifications,     // Notification[]
    isLoading,         // boolean
    addServiceUser,    // (user) => Promise<void>
    updateServiceUserStatus, // (id, status, msg?) => Promise<void>
    markNotificationAsRead,  // (id) => void
    clearAllNotifications,   // () => void
    refreshData        // () => Promise<void>
  } = useData()
  
  // Usage
  await addServiceUser({...})
  await updateServiceUserStatus('user-123', 'verified')
  await refreshData()
}
```

---

## 🛠️ Google Sheets Service

```typescript
import GoogleSheetsService from '@/lib/google-sheets.service'

// Check config
const config = GoogleSheetsService.getConfig()
const status = GoogleSheetsService.getConfigStatus()
const validation = GoogleSheetsService.validateConfig()

// Test connection
const isConnected = await GoogleSheetsService.checkConnection()

// Sync data
const result = await GoogleSheetsService.syncServiceUser(userData)
const doc = await GoogleSheetsService.uploadDocument(docData)
const updated = await GoogleSheetsService.updateStatus(
  userId, status, message
)

// Get data
const users = await GoogleSheetsService.getAllServiceUsers()
const notifs = await GoogleSheetsService.getNotifications(userId)

// Export
GoogleSheetsService.exportToCSV(data, 'filename.csv')

// Date utils
const isoDate = GoogleSheetsService.formatDateForSheets(new Date())
const date = GoogleSheetsService.parseDateFromSheets('2026-03-05T...')
```

---

## 🧪 Testing

### Browser Console

```javascript
// Quick test
await window.googleSheetsTest.quickTest()

// Full suite
await window.googleSheetsTest.runAllTests()

// Individual tests
await window.googleSheetsTest.testConfiguration()
await window.googleSheetsTest.testConnection()
await window.googleSheetsTest.testGetServiceUsers()
await window.googleSheetsTest.testCreateServiceUser()
```

### Manual API Test

```javascript
// In browser
https://[URL]/exec?action=getServiceUsers&apiKey=[KEY]

// Expected response
{
  "success": true,
  "data": [...],
  "timestamp": "2026-03-05T..."
}
```

---

## 🎨 Components

### Status Indicator

```tsx
import { GoogleSheetsStatus } from '@/components/GoogleSheetsStatus'

// Compact badge
<GoogleSheetsStatus compact />

// Full card
<GoogleSheetsStatus />
```

---

## 🔍 Debug Helpers

### Check Configuration

```typescript
import { getApiConfig, isApiConfigured } from '@/lib/api'

const config = getApiConfig()
console.log('Configured:', config.isConfigured)
console.log('URL:', config.url)
console.log('Has Key:', config.hasKey)

const configured = isApiConfigured()
console.log('Ready:', configured)
```

### Validate Config

```typescript
const validation = GoogleSheetsService.validateConfig()
if (!validation.valid) {
  console.error('Errors:', validation.errors)
}
```

### Enable Debug Logging

```typescript
localStorage.setItem('DEBUG_API', 'true')
```

---

## 📊 TypeScript Interfaces

### ServiceUser

```typescript
interface ServiceUser {
  id: string
  nama: string
  nik: string
  alamat: string
  noTelepon: string
  email: string
  jenisLayanan: string
  keterangan: string
  documents: Document[]
  status: 'pending' | 'verified' | 'rejected' | 'incomplete'
  statusMessage?: string
  createdAt: Date
  fieldOfficerId: string
  fieldOfficerName: string
}
```

### Document

```typescript
interface Document {
  id: string
  type: 'KTP' | 'KK' | 'NPWP' | 'OTHER'
  imageUrl: string
  ocrData?: {
    nik?: string
    nama?: string
    tanggalLahir?: string
  }
  ocrText?: string
  uploadedAt: Date
}
```

### Notification

```typescript
interface Notification {
  id: string
  type: 'verification' | 'message'
  title: string
  message: string
  userId: string
  timestamp: Date
  read: boolean
}
```

---

## 🚨 Error Handling

### Try-Catch Pattern

```typescript
try {
  const user = await api.createServiceUser(data)
  toast.success('Data tersimpan!')
} catch (error: any) {
  console.error('API Error:', error)
  toast.error('Gagal menyimpan data', {
    description: error.message
  })
}
```

### Loading States

```typescript
const [isLoading, setIsLoading] = useState(false)

setIsLoading(true)
try {
  await api.createServiceUser(data)
} finally {
  setIsLoading(false)
}
```

---

## 📝 Common Patterns

### Create with Documents

```typescript
await api.createServiceUser({
  // ... user data
  documents: [
    {
      type: 'KTP',
      imageUrl: base64Image,
      ocrText: ocrResult.text,
      ocrData: extractedData
    }
  ]
})
```

### Refresh Data

```typescript
const { refreshData } = useData()

// Manual refresh
await refreshData()

// Auto refresh every 30 seconds
useEffect(() => {
  const interval = setInterval(refreshData, 30000)
  return () => clearInterval(interval)
}, [])
```

### Filter & Search

```typescript
// Client-side filter
const pending = serviceUsers.filter(u => u.status === 'pending')
const myUsers = serviceUsers.filter(u => u.fieldOfficerId === user.id)
const search = serviceUsers.filter(u => 
  u.nama.toLowerCase().includes(query.toLowerCase())
)

// Server-side filter
const pending = await api.getServiceUsers({ status: 'pending' })
const myUsers = await api.getServiceUsers({ 
  fieldOfficerId: user.id 
})
```

---

## 🔑 Environment Setup

### .env File

```env
# Google Apps Script Backend
VITE_API_URL=https://script.google.com/macros/s/ABC123/exec
VITE_API_KEY=f2o_2026_kJ8mN4pQ9rT2vX5yZ7aB3cD6

# Storage type (optional)
VITE_STORAGE_TYPE=google-apps-script
```

### Access in Code

```typescript
const API_URL = import.meta.env.VITE_API_URL
const API_KEY = import.meta.env.VITE_API_KEY
```

---

## 🎯 Apps Script Functions

### In Apps Script Editor

```javascript
// Setup database (run once)
setupDatabase()

// Test API
testApi()

// View API docs
getApiDocumentation()

// Generate API key
generateApiKey()

// Backup database
backupDatabase()
```

---

## 🔗 Useful URLs

### Google Sheets
```
https://docs.google.com/spreadsheets/d/[SPREADSHEET_ID]/edit
```

### Google Drive
```
https://drive.google.com/drive/folders/[FOLDER_ID]
```

### Apps Script
```
https://script.google.com/home
```

### Web App (deployed)
```
https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
```

---

## 📚 Documentation Files

- **PANDUAN_CEPAT_GOOGLE_SHEETS.md** - Setup bahasa Indonesia
- **QUICK_SETUP_GOOGLE_SHEETS.md** - 5-minute setup
- **GOOGLE_SHEETS_API_SETUP.md** - Detailed setup
- **GOOGLE_SHEETS_INTEGRATION.md** - Technical docs
- **TEST_API.md** - Testing guide
- **IMPLEMENTATION_SUMMARY.md** - What's implemented

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| "API not configured" | Create `.env` with URLs & keys |
| "Connection failed" | Check API URL & key in `.env` |
| "Unauthorized" | API_KEY must match exactly |
| CORS error | Deploy with "Anyone" access |
| Data not saving | Check browser console & Network tab |
| Slow response | Check Apps Script execution logs |

---

## 💡 Pro Tips

1. **Always use TypeScript** - better autocomplete & type safety
2. **Check isLoading** - show loading states
3. **Handle errors** - use try-catch & toast notifications
4. **Test locally first** - use test suite before production
5. **Monitor logs** - check Apps Script executions regularly
6. **Backup weekly** - download sheet as Excel
7. **Update docs** - document custom changes
8. **Use status component** - show connection status to users

---

## ⚡ Performance Tips

```typescript
// ❌ Slow - multiple API calls
for (let user of users) {
  await api.updateServiceUserStatus(user.id, 'verified')
}

// ✅ Fast - batch in frontend, single UI update
const promises = users.map(u => 
  api.updateServiceUserStatus(u.id, 'verified')
)
await Promise.all(promises)
refreshData()
```

```typescript
// ✅ Cache data
const [cache, setCache] = useState({})

if (cache.users && Date.now() - cache.time < 60000) {
  return cache.users // Use cache if < 1 min old
}
```

---

## 🎓 Learning Path

1. ✅ Read **PANDUAN_CEPAT_GOOGLE_SHEETS.md**
2. ✅ Setup backend & frontend
3. ✅ Test with `quickTest()`
4. ✅ Create test user in app
5. ✅ Check data in Google Sheets
6. ✅ Read **GOOGLE_SHEETS_INTEGRATION.md**
7. ✅ Explore code in `/src/lib/api.ts`
8. ✅ Check **TEST_API.md** for advanced testing

---

**Bookmark this page for quick reference! 🔖**
