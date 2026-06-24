# 👥 Setup Users untuk Backend Login

Panduan untuk setup users di Google Sheets agar login terintegrasi dengan backend.

---

## 🎯 Overview

Aplikasi sekarang mendukung **dual authentication**:
1. **API Login** - Login via Google Apps Script (jika configured)
2. **Local Login** - Fallback ke local authentication (jika API tidak configured)

---

## 🔐 Cara Kerja Login

### Flow Login:

```
User memasukkan username & password
        ↓
Cek: Apakah API configured?
        ↓
    ┌───────────────┬───────────────┐
    │               │               │
  YES             NO              │
    │               │               │
    ↓               ↓               │
API Login     Local Login      │
    ↓               ↓               │
 Success?       Success?         │
    │               │               │
  ┌─┴──┐          ┌─┴──┐          │
 YES  NO         YES  NO          │
  │    │           │    │          │
  ↓    ↓           ↓    ↓          │
 ✅   Fallback    ✅   ❌         │
      to Local                     │
         │                         │
         └─────────────────────────┘
```

### Smart Fallback:
- API configured + API login gagal = Fallback ke local
- API tidak configured = Langsung local
- User tidak perlu tahu mode apa yang dipakai

---

## 📊 Setup Users di Google Sheets

### Jika Sudah Setup Google Apps Script:

#### 1. Buka Google Sheet

Buka sheet "Field-to-Office DB" yang sudah dibuat.

#### 2. Buka Tab "Users"

Sheet ini otomatis dibuat saat run `setupDatabase()`.

#### 3. Struktur Data

| id | email | password | fullName | role | phone | createdAt | updatedAt |
|----|-------|----------|----------|------|-------|-----------|-----------|
| officer-001 | adhy@fieldoffice.com | adhy123 | Adhy | field_officer | +628xxx | 2026-03-05... | 2026-03-05... |

#### 4. Tambah User Field Officer

**Copy row ini ke Sheet Users:**

```
officer-001 | adhy@fieldoffice.com | adhy123 | Adhy | field_officer | +6281234567890 | 2026-03-05T10:00:00.000Z | 2026-03-05T10:00:00.000Z
officer-002 | budi@fieldoffice.com | budi123 | Budi Hartono | field_officer | +6281234567891 | 2026-03-05T10:00:00.000Z | 2026-03-05T10:00:00.000Z
officer-003 | siti@fieldoffice.com | siti123 | Siti Nurhaliza | field_officer | +6281234567892 | 2026-03-05T10:00:00.000Z | 2026-03-05T10:00:00.000Z
```

#### 5. Tambah Admin User (Optional)

```
admin-001 | admin@test.com | admin123 | Administrator | admin | +6281234567800 | 2026-03-05T10:00:00.000Z | 2026-03-05T10:00:00.000Z
```

---

## 🔧 Login Credentials

### Field Officers (Local Mode):

| Username | Password | Email |
|----------|----------|-------|
| adhy | adhy123 | adhy@fieldoffice.com |
| budi | budi123 | budi@fieldoffice.com |
| siti | siti123 | siti@fieldoffice.com |

### Field Officers (API Mode):

**Login menggunakan EMAIL, bukan username:**

| Email | Password | Role |
|-------|----------|------|
| adhy@fieldoffice.com | adhy123 | field_officer |
| budi@fieldoffice.com | budi123 | field_officer |
| siti@fieldoffice.com | siti123 | field_officer |

**ATAU bisa tetap pakai username** - Aplikasi otomatis convert ke email.

### Admin (API Mode Only):

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | admin123 | admin |

---

## 💡 Smart Username Conversion

Aplikasi punya fitur **smart conversion**:

```javascript
// User input: "adhy"
// App converts to: "adhy@fieldoffice.com"

// User input: "adhy@fieldoffice.com"  
// App uses: "adhy@fieldoffice.com"
```

**Artinya:**
- User bisa login dengan username (`adhy`)
- ATAU dengan email (`adhy@fieldoffice.com`)
- Aplikasi otomatis handle keduanya

---

## 🧪 Testing Login

### Test Local Mode (API tidak configured):

```
1. Login dengan: adhy / adhy123
2. Expected: ✅ Login sukses (local auth)
3. Console: "🔐 Using local authentication"
```

### Test API Mode (API configured):

```
1. Login dengan: adhy@fieldoffice.com / adhy123
2. Expected: ✅ Login sukses (API auth)
3. Console: "🔐 Attempting API login..."
           "✅ API login successful"
```

### Test API Fallback:

```
1. API configured tapi user tidak ada di Sheet
2. Login dengan: adhy / adhy123
3. Expected: ✅ Login sukses (fallback to local)
4. Console: "⚠️ API login failed, falling back to local auth"
           "🔐 Using local authentication"
           "✅ Local login successful"
```

---

## 📝 Manual Add Users ke Google Sheet

### Via Google Sheets UI:

1. **Buka Sheet "Users"**

2. **Tambah row baru:**
   ```
   Column A (id):        officer-004
   Column B (email):     newuser@fieldoffice.com
   Column C (password):  newpass123
   Column D (fullName):  New User Name
   Column E (role):      field_officer
   Column F (phone):     +6281234567899
   Column G (createdAt): 2026-03-05T10:00:00.000Z
   Column H (updatedAt): 2026-03-05T10:00:00.000Z
   ```

3. **Save** (otomatis tersimpan)

4. **Test login:**
   ```
   Email: newuser@fieldoffice.com
   Password: newpass123
   ```

### Via Apps Script (Advanced):

1. **Buka Apps Script editor**

2. **Run function:**
   ```javascript
   function addUser() {
     const sheet = getOrCreateSheet(SHEETS.USERS);
     const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
     
     const newUser = {
       id: generateId(),
       email: 'newuser@fieldoffice.com',
       password: 'newpass123',
       fullName: 'New User Name',
       role: 'field_officer',
       phone: '+6281234567899',
       createdAt: getTimestamp(),
       updatedAt: getTimestamp()
     };
     
     const row = objectToRow(headers, newUser);
     sheet.appendRow(row);
     
     Logger.log('User added:', newUser);
   }
   ```

3. **Run** function `addUser()`

---

## 🔐 Security Best Practices

### 1. Change Default Passwords

**PENTING:** Ganti semua password default!

```
❌ JANGAN: adhy123, budi123, siti123, admin123
✅ GUNAKAN: Password yang kuat (min 8 karakter, kombinasi huruf/angka/simbol)
```

### 2. Password Hashing (Future Improvement)

Saat ini password disimpan **plain text** di Google Sheets.

**Untuk production yang lebih secure:**
- Gunakan password hashing (bcrypt, etc.)
- Implement di Apps Script backend
- Update login flow

**Tapi untuk MVP/internal use, current setup sudah cukup.**

### 3. API Key Protection

Pastikan API key tidak bocor:
```
✅ Simpan di .env (tidak di-commit ke Git)
✅ Gunakan random string panjang
✅ Ganti default key
```

---

## 🎯 Login Flow Examples

### Example 1: API Login Success

```javascript
User input: adhy / adhy123

Console:
🔐 Attempting API login... { email: 'adhy@fieldoffice.com' }
✅ API login successful { id: 'officer-001', name: 'Adhy', role: 'field_officer' }

Result: ✅ Logged in via API
```

### Example 2: API Fallback

```javascript
User input: adhy / adhy123
(User tidak ada di Google Sheet)

Console:
🔐 Attempting API login... { email: 'adhy@fieldoffice.com' }
⚠️ API login failed, falling back to local auth: User not found
🔐 Using local authentication
✅ Local login successful { id: 'officer-001', name: 'Adhy' }

Result: ✅ Logged in via local fallback
```

### Example 3: Local Only

```javascript
User input: adhy / adhy123
(API not configured)

Console:
🔐 Using local authentication
✅ Local login successful { id: 'officer-001', name: 'Adhy' }

Result: ✅ Logged in via local
```

---

## 📊 User Roles

### field_officer

**Permissions:**
- ✅ Create submissions
- ✅ View own submissions
- ✅ Upload documents
- ✅ View notifications
- ❌ Cannot verify/reject submissions

### admin

**Permissions:**
- ✅ View all submissions
- ✅ Verify/reject submissions
- ✅ View all users
- ✅ Manage notifications
- ✅ Full access

---

## 🔍 Troubleshooting

### Issue: "Username atau password salah" (API Mode)

**Solusi:**

1. **Check Sheet Users:**
   - Email ada di column B?
   - Password sama dengan input?
   - Role = `field_officer` atau `admin`?

2. **Check API Key:**
   - API_KEY di .env sama dengan Apps Script?
   - Case-sensitive!

3. **Test dengan email langsung:**
   ```
   Email: adhy@fieldoffice.com
   Password: adhy123
   ```

### Issue: Login lambat

**Normal!** Login flow:
1. Try API (2-3 detik)
2. If fail, fallback to local (0.5 detik)

**Total bisa 3-4 detik untuk first attempt.**

### Issue: Selalu fallback ke local

**Kemungkinan:**
- API tidak configured dengan benar
- Users tidak ada di Google Sheet
- API Key salah

**Check:**
```javascript
// In browser console
import { isApiConfigured } from '@/lib/api'
console.log('API Configured:', isApiConfigured())
```

---

## ✅ Checklist

**Setup Backend Login:**
- [ ] Google Apps Script deployed
- [ ] Database initialized (`setupDatabase()`)
- [ ] Sheet "Users" exists
- [ ] Field officers added to Sheet
- [ ] Admin user added (optional)
- [ ] Passwords changed from defaults
- [ ] Test login via email
- [ ] Test login via username
- [ ] Test fallback mechanism

---

## 🎉 Summary

**Authentication System:**
- ✅ Dual mode (API + Local fallback)
- ✅ Smart username conversion
- ✅ Seamless experience
- ✅ No user configuration needed
- ✅ Works in both Dev & Production mode

**User Management:**
- ✅ Easy to add users (Google Sheets)
- ✅ Role-based access
- ✅ Field officers & admins
- ✅ Secure with API key

**Next Steps:**
1. Add users to Google Sheet
2. Test login with API mode
3. Change default passwords
4. Deploy to production

---

**Login system ready! 🔐**
