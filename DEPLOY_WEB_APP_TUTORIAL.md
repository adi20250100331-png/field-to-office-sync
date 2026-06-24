# 🚀 Tutorial Deploy Apps Script as Web App

Panduan step-by-step dengan detail untuk deploy Google Apps Script sebagai Web App.

---

## 📋 Prasyarat

Pastikan sudah selesai:
- ✅ Google Sheet sudah dibuat
- ✅ Google Drive folder sudah dibuat  
- ✅ Kode backend sudah di-paste ke Apps Script
- ✅ SPREADSHEET_ID, DRIVE_FOLDER_ID, API_KEY sudah diganti
- ✅ Function setupDatabase() sudah dijalankan

---

## 🎯 Langkah-langkah Deploy

### STEP 1: Buka Apps Script Editor

1. Buka Google Sheet Anda ("Field-to-Office DB")
2. Klik menu **Extensions** (di toolbar atas)
3. Klik **Apps Script**
4. Apps Script editor akan terbuka di tab baru

```
Google Sheet > Extensions > Apps Script
```

---

### STEP 2: Pastikan Kode Sudah Tersimpan

1. Di Apps Script editor, pastikan kode backend sudah ada
2. Klik icon **Save** (💾) atau tekan **Ctrl+S**
3. Tunggu sampai muncul tulisan "Saved"
4. Pastikan nama project sudah diubah (klik "Untitled project" → rename)

```
Klik Save icon (💾) → Tunggu "Saved"
```

---

### STEP 3: Klik Tombol Deploy

1. Di pojok kanan atas Apps Script editor
2. Cari tombol **"Deploy"** (berwarna biru)
3. Klik tombol **Deploy**
4. Akan muncul dropdown menu

```
┌─────────────────────────────────┐
│  🔵 Deploy ▼                     │
└─────────────────────────────────┘
       ↓
┌─────────────────────────────────┐
│  → New deployment               │
│  → Manage deployments           │
│  → Test deployments             │
└─────────────────────────────────┘
```

---

### STEP 4: Pilih "New deployment"

1. Dari dropdown menu, klik **"New deployment"**
2. Dialog box akan muncul dengan judul "New deployment"

```
Klik: Deploy > New deployment
```

---

### STEP 5: Pilih Deployment Type

1. Di dialog box, lihat bagian atas
2. Klik icon **⚙️ (gear/settings icon)** di sebelah "Select type"
3. Akan muncul pilihan type:
   - Web app ✅ **← PILIH INI**
   - API Executable
   - Add-on
   - etc.
4. Klik **"Web app"**

```
┌───────────────────────────────────────┐
│  New deployment                       │
├───────────────────────────────────────┤
│                                       │
│  ⚙️ Select type ▼                    │
│  ┌─────────────────────────────────┐ │
│  │ → Web app        ✅             │ │
│  │   API Executable                │ │
│  │   Add-on                        │ │
│  │   ...                           │ │
│  └─────────────────────────────────┘ │
└───────────────────────────────────────┘
```

---

### STEP 6: Isi Configuration

Setelah pilih "Web app", form akan muncul. Isi sebagai berikut:

#### A. Description (Opsional)
```
Field-to-Office Backend API v1
```
Atau biarkan kosong juga boleh.

#### B. Web app
Bagian ini penting! Isi dengan benar:

**1. Execute as:**
```
┌─────────────────────────────────┐
│ Execute as:                     │
│ ┌─────────────────────────────┐ │
│ │ Me (your-email@gmail.com) ✅│ │  ← PILIH INI
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```
- Pilih: **"Me (your-email@gmail.com)"**
- Ini artinya script akan berjalan dengan permission Anda

**2. Who has access:**
```
┌─────────────────────────────────┐
│ Who has access:                 │
│ ┌─────────────────────────────┐ │
│ │ Anyone                    ✅│ │  ← PILIH INI
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```
- Pilih: **"Anyone"**
- ⚠️ PENTING: Harus "Anyone" agar bisa diakses dari frontend!

Pilihan lain yang tersedia (jangan dipilih):
- ❌ Only myself (script hanya bisa dipanggil oleh Anda)
- ❌ Anyone within [domain] (hanya untuk Google Workspace)

---

### STEP 7: Klik Deploy

1. Setelah semua terisi, klik tombol **"Deploy"** di pojok kanan bawah
2. Tunggu sebentar...

```
┌───────────────────────────────────────┐
│  New deployment                       │
├───────────────────────────────────────┤
│                                       │
│  Description:                         │
���  [Field-to-Office Backend API v1]     │
│                                       │
│  Web app                              │
│  Execute as: Me (email@gmail.com)     │
│  Who has access: Anyone               │
│                                       │
│              [Cancel]  [🔵 Deploy]   │
└───────────────────────────────────────┘
                            ↑
                       KLIK INI
```

---

### STEP 8: Authorize Access (PERTAMA KALI)

**⚠️ Ini hanya muncul pertama kali deploy:**

1. Dialog "Authorization required" akan muncul
2. Klik **"Authorize access"**

```
┌───────────────────────────────────────┐
│  ⚠️ Authorization required            │
├───────────────────────────────────────┤
│  This app needs permission to:        │
│  - Access your spreadsheets          │
│  - Access your Google Drive files    │
│                                       │
│         [🔵 Authorize access]        │
└───────────────────────────────────────┘
```

3. Pilih Google Account Anda
4. Layar warning akan muncul:

```
┌───────────────────────────────────────┐
│  ⚠️ Google hasn't verified this app   │
├───────────────────────────────────────┤
│  This app hasn't been verified by     │
│  Google yet.                          │
│                                       │
│  [Back to safety]                     │
│  Advanced ▼         ← KLIK INI        │
└───────────────────────────────────────┘
```

5. Klik **"Advanced"** (di pojok kiri bawah)
6. Akan muncul link **"Go to [project name] (unsafe)"**
7. Klik link tersebut

```
┌───────────────────────────────────────┐
│  ⚠️ Google hasn't verified this app   │
├───────────────────────────────────────┤
│  This app hasn't been verified...     │
│                                       │
│  Advanced ▼                           │
│  ↓                                    │
│  Go to Field-to-Office Backend        │
│  (unsafe)            ← KLIK INI       │
└───────────────────────────────────────┘
```

8. Layar permissions akan muncul:

```
┌───────────────────────────────────────┐
│  Field-to-Office Backend wants to:    │
├───────────────────────────────────────┤
│  ✓ See, edit, create, and delete     │
│    your spreadsheets                  │
│                                       │
│  ✓ See, edit, create, and delete     │
│    all your Google Drive files        │
│                                       │
│              [Cancel]  [🔵 Allow]    │
└───────────────────────────────────────┘
```

9. Scroll ke bawah
10. Klik **"Allow"**

---

### STEP 9: Copy Web App URL

Setelah berhasil deploy, dialog "Deployment" akan muncul:

```
┌───────────────────────────────────────┐
│  🎉 Deployment                        │
├───────────────────────────────────────┤
│  Deployment ID:                       │
│  AKfycby...abc123                     │
│                                       │
│  Web app                              │
│  URL:                                 │
│  https://script.google.com/macros/... │
│  [📋 Copy]          ← KLIK INI        │
│                                       │
│              [Done]                   │
└───────────────────────────────────────┘
```

1. Lihat bagian **"Web app URL"**
2. Klik tombol **"Copy"** (📋) di sebelah URL
3. URL akan otomatis ter-copy ke clipboard
4. **SIMPAN URL INI!** Anda akan membutuhkannya di frontend

Format URL:
```
https://script.google.com/macros/s/AKfycbx.../exec
                                      ↑
                                 Deployment ID
```

5. Klik **"Done"** untuk menutup dialog

---

### STEP 10: Test URL di Browser

1. Buka browser baru (Chrome/Firefox)
2. Paste URL yang sudah di-copy
3. Tambahkan parameter test:
```
https://script.google.com/macros/s/AKfycbx.../exec?action=getServiceUsers&apiKey=YOUR_API_KEY
```

4. Ganti `YOUR_API_KEY` dengan API key yang Anda set di script
5. Tekan Enter
6. Harusnya muncul response JSON:

```json
{
  "success": true,
  "data": [],
  "timestamp": "2026-03-04T12:00:00.000Z"
}
```

✅ Jika dapat response seperti ini = **BERHASIL!**

❌ Jika error, cek:
- API key sudah benar?
- Script sudah di-save?
- setupDatabase() sudah dijalankan?

---

## 🔄 Update/Re-deploy (Jika Ada Perubahan Kode)

Jika Anda edit kode dan ingin update deployment:

### Cara 1: New Deployment (URL Baru)
1. Edit kode
2. Save
3. Deploy > New deployment (ulangi step di atas)
4. Dapat URL baru
5. Update .env di frontend dengan URL baru

### Cara 2: Update Existing (URL Tetap) ✅ **RECOMMENDED**
1. Edit kode
2. Save
3. Klik **Deploy** > **Manage deployments**
4. Akan muncul list deployments
5. Klik icon **✏️ (Edit)** di deployment yang aktif
6. Klik dropdown **"Version"**
7. Pilih **"New version"**
8. Klik **"Deploy"**
9. URL tetap sama! Frontend tidak perlu update

```
Deploy > Manage deployments
↓
┌─────────────────────────────────────────────┐
│  Active deployments                         │
├─────────────────────────────────────────────┤
│  Web app                                    │
│  @1 - Field-to-Office Backend API v1        │
│  https://script.google.com/.../exec         │
│                                    [✏️ Edit] │ ← KLIK
└─────────────────────────────────────────────┘
↓
┌─────────────────────────────────────────────┐
│  Edit deployment                            │
├─────────────────────────────────────────────┤
│  Version: @1 ▼  ← KLIK                      │
│  ┌─────────────────────────────────────┐    │
│  │ → New version              ✅       │    │
│  │   @1 (current)                      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│                        [Cancel] [🔵 Deploy] │
└─────────────────────────────────────────────┘
```

---

## 🎯 Lokasi Tombol di Apps Script

Untuk memudahkan, berikut lokasi semua tombol:

```
┌─────────────────────────────────────────────────────────┐
│  Google Apps Script                                     │
├─────────────────────────────────────────────────────────┤
│  [<-] Field-to-Office Backend    [Run ▼] [🔵 Deploy ▼] │ ← KLIK INI
│  ────────────────────────────────────────────────────── │
│  function doGet(e) {                                    │
│    ...                                                  │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

Tombol **Deploy** ada di pojok **kanan atas**, sebelah tombol Run.

---

## 📝 Checklist Deploy

- [ ] Kode sudah di-paste ke Apps Script
- [ ] SPREADSHEET_ID sudah diganti
- [ ] DRIVE_FOLDER_ID sudah diganti
- [ ] API_KEY sudah diganti
- [ ] Kode sudah di-save (Ctrl+S)
- [ ] setupDatabase() sudah dijalankan (run sekali)
- [ ] Klik Deploy > New deployment
- [ ] Pilih type: Web app
- [ ] Execute as: Me
- [ ] Who has access: Anyone ⚠️ **PENTING!**
- [ ] Klik Deploy
- [ ] Authorize access (pertama kali)
- [ ] Klik Advanced > Go to project (unsafe)
- [ ] Klik Allow
- [ ] Copy Web App URL
- [ ] Test URL di browser
- [ ] Dapat response JSON = ✅ Berhasil!

---

## 🐛 Troubleshooting Deploy

### Issue: Tidak menemukan tombol "Deploy"
**Solusi:**
- Pastikan Anda di Apps Script editor (bukan Google Sheet)
- Refresh halaman
- Tombol di pojok kanan atas

### Issue: "Authorization required" tidak muncul
**Solusi:**
- Anda mungkin sudah pernah authorize sebelumnya
- Langsung ke step copy URL

### Issue: "This app hasn't been verified"
**Solusi:**
- Ini normal untuk script pribadi
- Klik Advanced > Go to [project name] (unsafe)
- Klik Allow
- Aman karena ini script Anda sendiri

### Issue: URL tidak berfungsi / error
**Solusi:**
1. Pastikan "Who has access" = **Anyone** (bukan "Only myself")
2. Pastikan API key di URL sama dengan di script
3. Cek Browser Console untuk detail error
4. Test dengan action sederhana dulu: `?action=getServiceUsers&apiKey=xxx`

### Issue: "Script function not found: doGet"
**Solusi:**
- Pastikan kode backend sudah complete
- Pastikan ada function `doGet(e)` dan `doPost(e)`
- Save ulang dan redeploy

---

## 💡 Tips

1. **Save URL di tempat aman:**
   - Notepad
   - .env file
   - Google Doc

2. **Format URL:**
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
   ```
   Bagian `[DEPLOYMENT_ID]` akan unique untuk Anda

3. **Jangan share Deployment ID ke publik:**
   - Gunakan API key untuk protection
   - Deployment ID + API key = double protection

4. **Bookmark Apps Script:**
   - Supaya mudah buka lagi untuk edit/update

---

## 🎉 Selesai!

Jika sudah berhasil copy URL dan test di browser menunjukkan response JSON, berarti **deploy berhasil!**

**Next step:**
1. Copy URL ke .env frontend:
   ```env
   VITE_API_URL=https://script.google.com/macros/s/.../exec
   VITE_API_KEY=your-api-key
   ```

2. Test dari frontend!

---

**Ada pertanyaan?** Cek screenshot atau chat lagi! 😊
