# 📊 Google Sheets Integration

Aplikasi Field-to-Office Sync terintegrasi dengan Google Sheets dan Google Drive untuk penyimpanan data.

---

## 🎯 Fitur

### ✅ Yang Sudah Terintegrasi:

1. **Google Sheets sebagai Database**
   - ServiceUsers (data pengajuan)
   - Documents (metadata file)
   - Notifications (sistem notifikasi)
   - Users (akun pengguna)
   - ActivityLogs (audit trail)

2. **Google Drive sebagai Storage**
   - Upload dokumen (KTP, KK, NPWP, dll)
   - OCR text & extracted data tersimpan
   - Auto-generate shareable links

3. **Real-time Sync**
   - Auto-save saat create service user
   - Update status langsung ke Sheets
   - Notifications untuk semua user

4. **Fallback Mode**
   - Jika API tidak dikonfigurasi → gunakan localStorage
   - Tidak ada data loss
   - Smooth transition dari local ke cloud

---

## 📦 Files

| File | Deskripsi |
|------|-----------|
| `/google-apps-script-backend.js` | Backend code (deploy ke Apps Script) |
| `/src/lib/api.ts` | API client untuk frontend |
| `/src/lib/google-sheets.service.ts` | Helper service & utilities |
| `/src/app/context/DataContext.tsx` | State management dengan API integration |
| `/src/app/components/GoogleSheetsStatus.tsx` | Status indicator component |
| `/.env.example` | Environment variables template |

---

## 🚀 Quick Start

### 1. Setup Backend (5 menit)

```bash
# Lihat panduan detail
QUICK_SETUP_GOOGLE_SHEETS.md
```

### 2. Configure Frontend

```bash
# Copy .env example
cp .env.example .env

# Edit .env dengan credentials Anda
VITE_API_URL=https://script.google.com/macros/s/[ID]/exec
VITE_API_KEY=your-api-key-here

# Restart server
npm run dev
```

### 3. Test

```typescript
// Di browser console
window.googleSheetsTest.quickTest()
```

---

## 🔧 How It Works

### Architecture

```
┌─────────────────┐
│  React App      │
│  (Frontend)     │
└────────┬────────┘
         │
         │ HTTP Requests
         │
┌────────▼────────────────────────┐
│  Google Apps Script             │
│  (Backend REST API)             │
└────────┬────────────────────────┘
         │
         ├──────────────┬─────────────┐
         │              │             │
┌────────▼────────┐  ┌──▼──────┐  ┌──▼──────┐
│ Google Sheets   │  │ Google  │  │ Gmail   │
│ (Database)      │  │ Drive   │  │ (Email) │
└─────────────────┘  └─────────┘  └─────────┘
```

### Data Flow

1. **Create Service User**
   ```
   User fills form → Submit
   → DataContext.addServiceUser()
   → api.createServiceUser()
   → POST to Apps Script
   → Save to Sheets
   → Upload docs to Drive
   → Return data
   → Update UI
   ```

2. **Update Status**
   ```
   Admin changes status → Submit
   → DataContext.updateServiceUserStatus()
   → api.updateServiceUserStatus()
   → POST to Apps Script
   → Update Sheets
   → Create notification
   → Return updated data
   → Refresh UI
   ```

---

## 📚 API Reference

### Service Users

```typescript
// Get all users
api.getServiceUsers({ status: 'pending' })

// Get by ID
api.getServiceUserById('user-123')

// Create new
api.createServiceUser({
  nama: 'John Doe',
  nik: '1234567890123456',
  // ... other fields
})

// Update status
api.updateServiceUserStatus(
  'user-123',
  'verified',
  'Dokumen lengkap'
)

// Delete
api.deleteServiceUser('user-123')
```

### Documents

```typescript
// Upload document
api.uploadDocument({
  serviceUserId: 'user-123',
  type: 'KTP',
  imageUrl: 'data:image/jpeg;base64,...',
  ocrText: 'OCR result...',
  ocrData: { nik: '1234...', nama: 'John' }
})

// Get documents
api.getDocuments('user-123')

// Delete document
api.deleteDocument('doc-123')
```

### Notifications

```typescript
// Get notifications
api.getNotifications('user-123', true) // unread only

// Mark as read
api.markNotificationAsRead('notif-123')

// Create notification
api.createNotification({
  userId: 'user-123',
  message: 'New update',
  type: 'system'
})
```

---

## 🧪 Testing

### Manual Testing

1. **Test API Connection**
   ```
   https://[YOUR_URL]/exec?action=getServiceUsers&apiKey=[KEY]
   ```

2. **Browser Console**
   ```javascript
   // Quick test
   await window.googleSheetsTest.quickTest()
   
   // Full test suite
   await window.googleSheetsTest.runAllTests()
   ```

### Test Functions

```typescript
import GoogleSheetsTest from '@/lib/__tests__/google-sheets-api.test'

// Test configuration
await GoogleSheetsTest.testConfiguration()

// Test connection
await GoogleSheetsTest.testConnection()

// Test create user
await GoogleSheetsTest.testCreateServiceUser()
```

---

## 🎨 UI Components

### Status Indicator

```tsx
import { GoogleSheetsStatus } from '@/components/GoogleSheetsStatus'

// Compact badge
<GoogleSheetsStatus compact />

// Full card with details
<GoogleSheetsStatus />
```

### Usage in DataContext

```tsx
import { useData } from '@/context/DataContext'

function MyComponent() {
  const { 
    serviceUsers,
    isLoading,
    addServiceUser,
    refreshData 
  } = useData()
  
  // isLoading = true saat API call
  // refreshData() = manual refresh dari API
}
```

---

## 🔐 Security

### Best Practices

1. **API Key**
   - ✅ Use random string (min 20 chars)
   - ✅ Never commit to Git
   - ✅ Store in .env only
   - ❌ Don't hardcode in source

2. **Deployment**
   - ✅ Deploy with "Anyone" access (for CORS)
   - ✅ API key protects endpoints
   - ✅ Enable 2FA on Google Account

3. **Data Protection**
   - ✅ Regular backups (weekly)
   - ✅ Monitor execution logs
   - ✅ Review ActivityLogs sheet

---

## 📊 Monitoring

### Apps Script Executions

1. Open Apps Script editor
2. Click **Executions** (sidebar)
3. View all API calls and errors

### Google Sheets

- Direct access to all data
- Real-time updates
- Export as Excel for backup

### Activity Logs

Check `ActivityLogs` sheet for:
- All user actions
- API calls
- Status changes
- Document uploads

---

## 🐛 Troubleshooting

### Common Issues

1. **"API not configured"**
   - Create `.env` file
   - Add `VITE_API_URL` and `VITE_API_KEY`
   - Restart dev server

2. **"Connection failed"**
   - Check API URL is correct
   - Test in browser: `[URL]?action=getServiceUsers&apiKey=[KEY]`
   - Check browser console for errors

3. **"Unauthorized"**
   - API_KEY must match exactly (case-sensitive)
   - Check Apps Script and .env have same key

4. **CORS Error**
   - Deploy with "Who has access: **Anyone**"
   - Don't use "Only myself"

### Debug Mode

```typescript
// Enable verbose logging
localStorage.setItem('DEBUG_API', 'true')

// Check config
import { getApiConfig } from '@/lib/api'
console.log(getApiConfig())

// Test connection
import GoogleSheetsService from '@/lib/google-sheets.service'
await GoogleSheetsService.checkConnection()
```

---

## 📈 Performance

### Optimization Tips

1. **Caching**
   - DataContext caches service users
   - Manual refresh with `refreshData()`
   - Auto-refresh on auth state change

2. **Batch Operations**
   - Upload multiple docs in single call
   - Batch status updates

3. **Pagination**
   - For large datasets (100+ users)
   - Implement in Apps Script backend

### Limits (Free Tier)

| Resource | Limit |
|----------|-------|
| URL Fetch calls | 20,000/day |
| Script runtime | 6 min/execution |
| Triggers | 20/user |
| Drive storage | 15 GB |

---

## 🔄 Migration

### From Local to Cloud

Aplikasi otomatis detect konfigurasi:

1. **Local Mode** (no .env)
   - Data in localStorage
   - No sync

2. **Cloud Mode** (.env configured)
   - Auto-save to Sheets
   - Upload to Drive
   - Real-time sync

### Export/Import Data

```typescript
import GoogleSheetsService from '@/lib/google-sheets.service'

// Export to CSV
GoogleSheetsService.exportToCSV(serviceUsers, 'backup.csv')

// Import: paste to Google Sheets directly
```

---

## 📖 Full Documentation

- **[QUICK_SETUP_GOOGLE_SHEETS.md](./QUICK_SETUP_GOOGLE_SHEETS.md)** - 5 menit setup
- **[GOOGLE_SHEETS_API_SETUP.md](./GOOGLE_SHEETS_API_SETUP.md)** - Panduan lengkap
- **[GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)** - Apps Script detail
- **[google-apps-script-backend.js](./google-apps-script-backend.js)** - Backend source

---

## ✅ Checklist

Setup:
- [ ] Google Sheet created
- [ ] Google Drive folder created
- [ ] Apps Script deployed
- [ ] .env configured
- [ ] API tested
- [ ] First user created successfully

Security:
- [ ] API key changed from default
- [ ] Admin password changed
- [ ] Backup created
- [ ] Team trained

---

## 🎉 Success!

Aplikasi Anda sekarang terhubung dengan Google Sheets!

**Benefits:**
- ✅ 100% GRATIS
- ✅ Unlimited users (sampai quota)
- ✅ Real-time sync
- ✅ Easy to maintain
- ✅ Built-in backup (Google)
- ✅ Accessible dari mana saja

**Next Steps:**
1. Deploy frontend ke production
2. Train field officers
3. Monitor usage
4. Collect feedback
5. Iterate & improve

---

**Questions?** Check documentation atau browser console untuk errors.

**Happy syncing! 🚀**
