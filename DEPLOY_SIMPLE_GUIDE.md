# 🎬 Deploy Web App - Panduan Super Simpel

Tutorial seperti nonton video, step-by-step dengan gambar di kepala.

---

## 🎯 Yang Akan Kita Lakukan

Kita akan "publish" kode Apps Script supaya bisa diakses dari internet (frontend).
Seperti upload video ke YouTube, tapi ini upload API ke Google.

---

## 📍 Dimana Tombol Deploy?

Bayangkan Anda sedang di Apps Script editor (layar putih dengan kode):

```
╔═══════════════════════════════════════════════════════╗
║ Google Apps Script                                    ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║  Pojok Kiri Atas          Pojok Kanan Atas           ║
║  ↓                        ↓                           ║
║  Field-to-Office Backend  [▶️ Run ▼]  [🔵 Deploy ▼]  ║
║                                           ↑           ║
║                                      TOMBOL INI!      ║
║  ─────────────────────────────────────────────────    ║
║                                                       ║
║  function doGet(e) {                                  ║
║    // kode Anda di sini...                           ║
║  }                                                    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

Tombol **Deploy** ada di pojok **kanan atas**, warna **biru**.

---

## 🚀 Langkah Deploy (5 Menit)

### 1️⃣ Klik Tombol Deploy

- Cari tombol biru bertuliskan **"Deploy"** di pojok kanan atas
- Klik tombol tersebut
- Akan keluar menu dropdown

**Apa yang keluar:**
```
┌─────────────────────┐
│ → New deployment    │  ← KLIK INI
│   Manage deployments│
│   Test deployments  │
└─────────────────────┘
```

### 2️⃣ Klik "New deployment"

- Dari menu yang muncul, pilih yang paling atas: **"New deployment"**
- Jendela baru akan popup

---

### 3️⃣ Pilih Type: Web App

Di jendela popup:

**Lihat tulisan:** "Select type"  
**Di sebelahnya ada:** Icon ⚙️ (seperti gear/roda gigi)  
**Klik:** Icon ⚙️ tersebut

**Akan keluar pilihan:**
```
┌──────────────────┐
│ Web app         │ ← KLIK INI ✅
│ API Executable  │
│ Add-on          │
└──────────────────┘
```

**Pilih:** "Web app" (yang paling atas)

---

### 4️⃣ Isi Form (2 field penting)

Setelah pilih "Web app", form akan muncul:

#### Field 1: Execute as
```
Execute as: 
[Me (email-anda@gmail.com) ▼]
```
**PILIH:** "Me (email Anda)"  
**Artinya:** Script akan jalan pakai akun Anda

---

#### Field 2: Who has access ⚠️ **PENTING!**
```
Who has access:
[Anyone ▼]
```
**PILIH:** "Anyone"  
**Jangan pilih:** "Only myself"

**Kenapa harus "Anyone"?**  
Supaya frontend bisa akses API ini. Kalau pilih "Only myself", frontend akan ditolak.

**Apakah aman?**  
Aman, karena kita sudah pakai API key untuk proteksi.

---

### 5️⃣ Klik Deploy (Tombol Biru)

- Di pojok kanan bawah popup, ada tombol biru **"Deploy"**
- Klik tombol tersebut
- Tunggu sebentar...

---

### 6️⃣ Authorize (Hanya Pertama Kali)

**Jika ini pertama kali Anda deploy, akan muncul popup:**

#### Step A: Klik "Authorize access"
```
┌────────────────────────────────┐
│ ⚠️ Authorization required       │
│                                │
│ This app needs permission...   │
│                                │
│    [Authorize access]          │ ← KLIK
└────────────────────────────────┘
```

#### Step B: Pilih Akun Google Anda
- Pilih email yang Anda gunakan untuk buat Apps Script

#### Step C: Klik "Advanced"
Akan muncul warning merah:
```
┌────────────────────────────────┐
│ ⚠️ Google hasn't verified       │
│    this app                    │
│                                │
│ [Back to safety]               │
│                                │
│ Advanced ▼        ← KLIK INI   │
└────────────────────────────────┘
```

Jangan takut! Ini normal untuk script pribadi.

#### Step D: Klik "Go to ... (unsafe)"
Setelah klik "Advanced", akan muncul link biru:
```
Go to Field-to-Office Backend (unsafe)
         ↑ KLIK LINK INI
```

#### Step E: Klik "Allow"
Layar permissions muncul:
```
┌────────────────────────────────┐
│ Field-to-Office Backend        │
│ wants to:                      │
│                                │
│ ✓ Access your spreadsheets    │
│ ✓ Access your Google Drive    │
│                                │
│         [Allow]  ← KLIK INI    │
└────────────────────────────────┘
```

---

### 7️⃣ Copy URL ✨

**Setelah berhasil, popup success muncul:**

```
┌─────────────────────────────────────┐
│ 🎉 Deployment                       │
├─────────────────────────────────────┤
│                                     │
│ Web app                             │
│ URL:                                │
│ https://script.google.com/macros... │
│                                     │
│ [📋 Copy]        ← KLIK INI         │
│                                     │
│          [Done]                     │
└─────────────────────────────────────┘
```

**Action:**
1. Klik tombol **"Copy"** (📋)
2. URL akan otomatis tersimpan di clipboard
3. **JANGAN HILANGKAN URL INI!**
4. Paste di Notepad atau langsung ke .env

**Format URL yang Anda dapat:**
```
https://script.google.com/macros/s/AKfycbxXXXXXX/exec
```

5. Klik **"Done"**

---

## ✅ Test URL - Pastikan Berhasil!

### Copy URL ke Browser

1. Buka **tab browser baru**
2. Paste URL yang sudah di-copy
3. Tambahkan di belakangnya:
   ```
   ?action=getServiceUsers&apiKey=YOUR_API_KEY
   ```

**Contoh lengkap:**
```
https://script.google.com/macros/s/AKfycbxXXX/exec?action=getServiceUsers&apiKey=f2o_2026_secret
```

4. Ganti `YOUR_API_KEY` dengan API key yang Anda set di script
5. Tekan **Enter**

---

### Hasil yang Diharapkan ✅

Jika berhasil, browser akan menampilkan text JSON seperti ini:

```json
{
  "success": true,
  "data": [],
  "timestamp": "2026-03-04T12:00:00.000Z"
}
```

**Artinya:**
- ✅ Deploy berhasil!
- ✅ API berjalan!
- ✅ Data kosong karena belum ada input

---

### Jika Ada Error ❌

#### Error: "Unauthorized: Invalid API key"
**Penyebab:** API key salah  
**Solusi:**
1. Buka Apps Script
2. Cek line: `const API_KEY = '...'`
3. Copy API key tersebut
4. Paste di URL (ganti YOUR_API_KEY)

#### Error: "Missing action parameter"
**Penyebab:** URL tidak lengkap  
**Solusi:** Pastikan ada `?action=getServiceUsers&apiKey=...`

#### Error: Blank page / tidak muncul apa-apa
**Penyebab:** "Who has access" bukan "Anyone"  
**Solusi:**
1. Kembali ke Apps Script
2. Deploy > Manage deployments
3. Edit deployment
4. Ganti "Who has access" ke "Anyone"
5. Deploy ulang

---

## 📝 Ringkasan Singkat

**Deploy = 7 Steps:**
1. ✅ Klik **Deploy** (tombol biru, pojok kanan atas)
2. ✅ Pilih **New deployment**
3. ✅ Klik ⚙️ → Pilih **Web app**
4. ✅ Execute as: **Me**
5. ✅ Who has access: **Anyone** ⚠️
6. ✅ Klik **Deploy** → Authorize (pertama kali)
7. ✅ **Copy URL** → Test di browser

---

## 🎯 Apa Selanjutnya?

Setelah dapat URL:

### 1. Update .env di Frontend
```env
VITE_API_URL=https://script.google.com/macros/s/AKfycbxXXX/exec
VITE_API_KEY=f2o_2026_secret
```

### 2. Test dari Aplikasi
- Jalankan `pnpm run dev`
- Coba create service user
- Coba upload dokumen
- Check Google Sheet → data muncul!

---

## 🔄 Update Kode Nanti (Bonus)

Jika Anda edit kode dan mau update:

**Cara Cepat (URL tetap):**
1. Edit kode di Apps Script
2. Save (Ctrl+S)
3. **Deploy** > **Manage deployments**
4. Klik **✏️ Edit** (icon pensil)
5. Version: Pilih **New version**
6. Klik **Deploy**
7. ✅ Done! URL tetap sama

Frontend tidak perlu update apa-apa!

---

## 💡 Tips Penting

1. **Simpan URL di 3 tempat:**
   - .env file (untuk coding)
   - Notepad (backup)
   - Google Doc (dokumentasi)

2. **API Key harus sama:**
   - Di Apps Script: `const API_KEY = 'xxx'`
   - Di .env: `VITE_API_KEY=xxx`
   - Di test URL: `...&apiKey=xxx`

3. **Jangan takut "unsafe":**
   - Itu warning standard Google
   - Script Anda = script Anda sendiri
   - Aman!

4. **Bookmark Apps Script:**
   - Supaya gampang buka lagi

---

## 🎉 Selesai!

Jika test URL berhasil muncul JSON, **SUKSES!** 🎊

Anda baru saja:
- ✅ Deploy backend API pertama Anda
- ✅ Buat REST API dengan Google Apps Script
- ✅ Siap connect ke frontend

**Next:** Update .env dan test dari aplikasi!

---

**Masih bingung di step mana?** Chat lagi, saya bantu! 😊
