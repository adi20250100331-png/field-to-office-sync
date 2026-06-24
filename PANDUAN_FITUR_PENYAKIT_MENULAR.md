# 🚨 PANDUAN IMPLEMENTASI FITUR JENAZAH PENYAKIT MENULAR

## 📋 OVERVIEW

Fitur ini menambahkan **peringatan protokol kesehatan** untuk jenazah dengan penyakit menular, lengkap dengan:
- ✅ Checkbox khusus "Jenazah Penyakit Menular"
- ✅ Dialog peringatan dengan 2 varian (Warning & Checklist)
- ✅ Konfirmasi protokol dengan timestamp
- ✅ Validasi form server-side & client-side
- ✅ Loading state saat submit
- ✅ Audit trail di Google Sheets

---

## 🎨 KOMPONEN YANG DIBUAT

### 1. **InfectiousDiseaseAlert** (`/src/app/components/InfectiousDiseaseAlert.tsx`)

Komponen dialog peringatan dengan 2 varian:

**Variant: "warning" (Default)**
- Background gradient merah-orange
- Icon AlertTriangle dengan animasi pulse
- Fokus pada BAHAYA dan LARANGAN
- Tombol: "SAYA PAHAM & PATUH"

**Variant: "checklist"**
- Background gradient amber
- Icon Shield
- Fokus pada CHECKLIST PROSEDUR
- 3 item checklist: Kargo khusus, Tidak dibuka, Protokol kesehatan
- Tombol: "LANJUTKAN PENGAJUAN"

**Props:**
```typescript
interface InfectiousDiseaseAlertProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'warning' | 'checklist';
}
```

---

## 🔧 UPDATE YANG DILAKUKAN

### 1. **DataCollectionForm.tsx**

#### State Baru:
```typescript
const [jenazahPenyakitMenular, setJenazahPenyakitMenular] = useState(false);
const [showInfectiousAlert, setShowInfectiousAlert] = useState(false);
const [infectiousProtocolConfirmed, setInfectiousProtocolConfirmed] = useState(false);
const [infectiousProtocolTimestamp, setInfectiousProtocolTimestamp] = useState<string | null>(null);
const [isSubmitting, setIsSubmitting] = useState(false);
```

#### Handler Functions:
- `handleInfectiousDiseaseToggle()` - Toggle checkbox & show alert
- `handleInfectiousProtocolConfirm()` - Konfirmasi protokol & simpan timestamp
- `handleInfectiousProtocolCancel()` - Batalkan protokol

#### Validasi di handleSubmit():
1. ✅ Validasi waktu dan tempat
2. ✅ Validasi minimal satu dokumen dilampirkan
3. ✅ Validasi kesimpulan pemeriksaan
4. ✅ **BARU:** Validasi protokol penyakit menular dikonfirmasi
5. ✅ Validasi nama pengantar dan pemeriksa

#### UI Updates:
- Checkbox penyakit menular dengan border gradient animasi
- Badge "Protokol Dikonfirmasi ✓" saat confirmed
- Loading state di button submit dengan icon Loader2
- Disabled button saat isSubmitting = true

---

## 📊 DATA YANG DISIMPAN

### Client-Side (localStorage via DataContext):

```javascript
{
  // ... data existing ...
  keterangan: "Kesimpulan: MEMENUHI SYARAT. Pengantar: Ahmad. Pemeriksa: Dr. Budi. 
               [JENAZAH PENYAKIT MENULAR - Protokol Dikonfirmasi pada 05/03/2026 14:30:00]"
}
```

### Server-Side (Google Sheets - jika terintegrasi):

**Kolom Tambahan di Sheet "ServiceUsers":**
```
| tanggal_pemeriksaan | lokasi_pemeriksaan | nama_pengantar | nama_pemeriksa | kesimpulan |
| jenazah_penyakit_menular | infectious_protocol_confirmed | infectious_protocol_timestamp |
```

**Contoh Data:**
```
tanggal_pemeriksaan: "2026-03-05"
lokasi_pemeriksaan: "Bandara Kupang"
nama_pengantar: "Ahmad Fauzi"
nama_pemeriksa: "Dr. Budi Santoso"
kesimpulan: "memenuhi"
jenazah_penyakit_menular: true
infectious_protocol_confirmed: true
infectious_protocol_timestamp: "2026-03-05T14:30:00.000Z"
```

---

## 🔒 VALIDASI

### Client-Side Validation:

```typescript
// 1. Waktu & Tempat
if (!waktuTempat.hari || !waktuTempat.tanggal || !waktuTempat.jam || !waktuTempat.lokasi) {
  toast.error('Lengkapi data waktu dan tempat');
  return;
}

// 2. Minimal satu dokumen
const hasDokumen = Object.values(kelengkapanDokumen).some(val => val === true);
if (!hasDokumen) {
  toast.error('Minimal salah satu dokumen harus dilampirkan');
  return;
}

// 3. Kesimpulan
if (!kesimpulan) {
  toast.error('Tentukan kesimpulan pemeriksaan');
  return;
}

// 4. PROTOKOL PENYAKIT MENULAR (BARU!)
if (jenazahPenyakitMenular && !infectiousProtocolConfirmed) {
  toast.error('Protokol Belum Dikonfirmasi');
  return;
}

// 5. Nama pengantar & pemeriksa
if (!namaPengantar || !namaPemeriksa) {
  toast.error('Nama pengantar dan pemeriksa harus diisi');
  return;
}
```

### Server-Side Validation:

Lihat file: `/google-apps-script-validation-example.js`

```javascript
function validateFormData(data) {
  // 1. Field wajib
  if (!data.tanggal) errors.push('Tanggal harus diisi');
  if (!data.lokasi) errors.push('Lokasi harus diisi');
  if (!data.nama_pengantar) errors.push('Nama pengantar harus diisi');
  
  // 2. Minimal satu dokumen
  const hasDokumen = data.surat_kematian || data.surat_pengawetan || ...;
  if (!hasDokumen) errors.push('Minimal satu dokumen harus dilampirkan');
  
  // 3. Kesimpulan valid
  if (!data.kesimpulan || (data.kesimpulan !== 'memenuhi' && data.kesimpulan !== 'tidak-memenuhi')) {
    errors.push('Kesimpulan tidak valid');
  }
  
  // 4. VALIDASI PENYAKIT MENULAR (BARU!)
  if (data.jenazah_penyakit_menular === true) {
    if (!data.infectious_protocol_confirmed) {
      errors.push('Protokol penyakit menular harus dikonfirmasi');
    }
    if (!data.infectious_protocol_timestamp) {
      errors.push('Timestamp konfirmasi tidak valid');
    }
  }
  
  if (errors.length > 0) {
    throw new Error('Validasi gagal: ' + errors.join('; '));
  }
  
  return true;
}
```

---

## 🎯 CARA MENGGUNAKAN

### Untuk Petugas Lapangan:

1. **Buka Form Pemeriksaan Jenazah**
   - Navigate ke: `/data-collection`

2. **Isi Step 1: Waktu & Tempat**
   - Hari, Tanggal, Jam, Lokasi

3. **Step 2: Kelengkapan Dokumen**
   - Centang dokumen yang tersedia
   - **Jika jenazah penyakit menular:**
     - Scroll ke bawah
     - Centang checkbox **"⚠️ Jenazah Penyakit Menular"**
     - Dialog peringatan akan muncul
     - Baca protokol dengan SEKSAMA
     - Klik **"SAYA PAHAM & PATUH"**
     - Badge "Protokol Dikonfirmasi ✓" akan muncul
     - Timestamp akan tercatat

4. **Step 3: Pemeriksaan Fisik Peti**
   - Lakukan pemeriksaan normal

5. **Step 4: Review & Submit**
   - Review semua data
   - Klik "Kirim Laporan"
   - Loading akan muncul
   - Tunggu hingga sukses

---

## 🚨 ALUR PROTOKOL PENYAKIT MENULAR

```
┌─────────────────────────────────────────┐
│ User centang checkbox penyakit menular  │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│ Dialog peringatan muncul                │
│ • Warning variant (merah)               │
│ • Highlight: TIDAK BOLEH DIBUKA         │
│ • 2 tombol: Batal / SAYA PAHAM & PATUH  │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        ▼                ▼
    [Batal]      [SAYA PAHAM & PATUH]
        │                │
        │                ▼
        │    ┌──────────────────────────────┐
        │    │ Timestamp tercatat           │
        │    │ infectiousProtocolTimestamp  │
        │    │ = "2026-03-05T14:30:00.000Z" │
        │    └──────────────┬───────────────┘
        │                   │
        │                   ▼
        │    ┌─────────────────────────────���┐
        │    │ Badge muncul:                │
        │    │ "Protokol Dikonfirmasi ✓"   │
        │    └──────────────┬───────────────┘
        │                   │
        │                   ▼
        │         [Lanjut ke step berikutnya]
        │                   │
        ▼                   ▼
    [Checkbox     [Submit form]
     unchecked]            │
                           ▼
                 ┌─────────────────────────┐
                 │ Data tersimpan dengan:  │
                 │ • jenazah_penyakit_     │
                 │   menular: true         │
                 │ • timestamp konfirmasi  │
                 │ • keterangan lengkap    │
                 └─────────────────────────┘
```

---

## 📝 CONTOH NOTIFIKASI & PESAN

### 1. Saat Checkbox Dicentang (Confirm):
```
✅ Protokol Dikonfirmasi
Persetujuan tercatat pada 05/03/2026, 14:30:00
```

### 2. Saat Checkbox Di-Uncheck (Cancel):
```
ℹ️ Protokol penyakit menular dibatalkan
```

### 3. Validasi Gagal (Belum Dikonfirmasi):
```
❌ Protokol Belum Dikonfirmasi
Mohon konfirmasi protokol penyakit menular terlebih dahulu
```

### 4. Submit Berhasil:
```
✅ Data pemeriksaan jenazah berhasil dikirim!
Data akan segera diverifikasi oleh admin kantor
```

### 5. Notifikasi untuk Admin:
```
Pengajuan baru dari Ahmad Fauzi [⚠️ PENYAKIT MENULAR]
```

---

## 🎨 STYLING & DESIGN

### Color Scheme:

**Warning Variant:**
- Background: `from-red-50 via-white to-orange-50` (light mode)
- Border: `border-red-500` (2px)
- Button: `from-red-600 to-red-700`
- Icon: `text-red-600` with `animate-pulse`

**Checklist Variant:**
- Background: `from-amber-50 via-white to-amber-50` (light mode)
- Border: `border-amber-400` (2px)
- Button: `from-amber-500 to-amber-600`
- Icon: `text-amber-600`

**Checkbox Highlight:**
- Container: `bg-gradient-to-r from-red-500 via-amber-500 to-red-500`
- Animation: `animate-pulse`
- Active state: `bg-red-100` dengan `border-red-500`

### Typography:

- Title: `text-2xl font-bold`
- Important text: `font-extrabold` dengan background highlight
- Timestamp: `text-xs text-green-700`
- Warning: `font-bold` dengan emoji ⚠️

---

## 🧪 TESTING CHECKLIST

### Test Scenario 1: Happy Path
- [ ] Centang checkbox penyakit menular
- [ ] Dialog muncul dengan tampilan yang benar
- [ ] Klik "SAYA PAHAM & PATUH"
- [ ] Badge "Protokol Dikonfirmasi ✓" muncul
- [ ] Timestamp tercatat
- [ ] Submit form berhasil
- [ ] Data tersimpan dengan flag penyakit menular

### Test Scenario 2: Cancel Protocol
- [ ] Centang checkbox
- [ ] Dialog muncul
- [ ] Klik "Batal"
- [ ] Checkbox kembali unchecked
- [ ] Toast info muncul

### Test Scenario 3: Uncheck After Confirm
- [ ] Centang checkbox
- [ ] Konfirmasi protokol
- [ ] Uncheck checkbox
- [ ] Toast info muncul
- [ ] Flag dan timestamp di-reset

### Test Scenario 4: Validation Error
- [ ] Centang checkbox TANPA konfirmasi
- [ ] Isi semua field lain
- [ ] Klik submit
- [ ] Error "Protokol Belum Dikonfirmasi" muncul
- [ ] Form tidak ter-submit

### Test Scenario 5: Loading State
- [ ] Isi semua field dengan benar
- [ ] Klik "Kirim Laporan"
- [ ] Button berubah jadi "Mengirim..." dengan spinner
- [ ] Button disabled selama proses
- [ ] Setelah selesai, navigate ke dashboard

### Test Scenario 6: Dark Mode
- [ ] Toggle dark mode
- [ ] Dialog tetap readable
- [ ] Kontras warna bagus
- [ ] Checkbox visible

---

## 🔄 INTEGRASI DENGAN GOOGLE SHEETS

### Step 1: Update Sheet Headers

Buka Google Sheet "Field-to-Office DB" → Sheet "ServiceUsers"

Tambahkan kolom baru (setelah kolom `updatedAt`):
```
| tanggal_pemeriksaan | lokasi_pemeriksaan | nama_pengantar | nama_pemeriksa | 
| kesimpulan | jenazah_penyakit_menular | infectious_protocol_confirmed | 
| infectious_protocol_timestamp |
```

### Step 2: Update Apps Script

Buka file `google-apps-script-backend.js`

**Update function `initializeSheetHeaders()`:**
```javascript
case SHEETS.SERVICE_USERS:
  headers = [
    'id', 'nama', 'nik', 'alamat', 'noTelepon', 'email', 
    'jenisLayanan', 'keterangan', 'status', 'statusMessage',
    'fieldOfficerId', 'fieldOfficerName', 'createdAt', 'updatedAt',
    // TAMBAHKAN INI:
    'tanggal_pemeriksaan', 'lokasi_pemeriksaan', 'nama_pengantar', 
    'nama_pemeriksa', 'kesimpulan', 'jenazah_penyakit_menular',
    'infectious_protocol_confirmed', 'infectious_protocol_timestamp'
  ];
  break;
```

**Update function `createServiceUser()`:**
```javascript
const user = {
  // ... field existing ...
  
  // TAMBAHKAN INI:
  tanggal_pemeriksaan: userData.tanggal_pemeriksaan || '',
  lokasi_pemeriksaan: userData.lokasi_pemeriksaan || '',
  nama_pengantar: userData.nama_pengantar || '',
  nama_pemeriksa: userData.nama_pemeriksa || '',
  kesimpulan: userData.kesimpulan || '',
  jenazah_penyakit_menular: userData.jenazah_penyakit_menular || false,
  infectious_protocol_confirmed: userData.infectious_protocol_confirmed || false,
  infectious_protocol_timestamp: userData.infectious_protocol_timestamp || '',
};
```

**Tambahkan function `validateFormData()`:**
```javascript
// Copy dari file google-apps-script-validation-example.js
```

### Step 3: Redeploy Apps Script

1. Save script
2. Deploy → New deployment
3. Update Web App URL di `.env.local` (jika berubah)
4. Test endpoint

---

## 📖 FILES YANG DIBUAT/DIUPDATE

### Files Baru:
1. ✅ `/src/app/components/InfectiousDiseaseAlert.tsx` - Dialog component
2. ✅ `/google-apps-script-validation-example.js` - Contoh validasi backend
3. ✅ `/PANDUAN_FITUR_PENYAKIT_MENULAR.md` - Dokumentasi ini

### Files Diupdate:
1. ✅ `/src/app/pages/DataCollectionForm.tsx`
   - State baru untuk penyakit menular
   - Handler functions
   - Validasi di handleSubmit
   - Checkbox UI dengan highlight
   - Loading state di submit button
   - Import InfectiousDiseaseAlert

---

## 🆘 TROUBLESHOOTING

### ❌ Dialog tidak muncul saat checkbox dicentang

**Penyebab:** Import InfectiousDiseaseAlert gagal

**Solusi:**
```typescript
// Pastikan import ada di DataCollectionForm.tsx
import { InfectiousDiseaseAlert } from '../components/InfectiousDiseaseAlert';
```

---

### ❌ Loading state tidak muncul

**Penyebab:** State `isSubmitting` tidak di-set

**Solusi:**
```typescript
// Pastikan di handleSubmit():
setIsSubmitting(true);
try {
  // ... submit logic ...
} catch (error) {
  setIsSubmitting(false); // Reset jika error
}
```

---

### ❌ Validasi tidak berjalan

**Penyebab:** Logika validasi tidak dipanggil

**Solusi:**
```typescript
// Pastikan validasi ada sebelum submit:
if (jenazahPenyakitMenular && !infectiousProtocolConfirmed) {
  toast.error('Protokol Belum Dikonfirmasi');
  return; // PENTING: return untuk stop execution
}
```

---

### ❌ Timestamp tidak tersimpan

**Penyebab:** State tidak di-set saat konfirmasi

**Solusi:**
```typescript
const handleInfectiousProtocolConfirm = () => {
  const timestamp = new Date().toISOString(); // Generate timestamp
  setInfectiousProtocolTimestamp(timestamp); // Simpan ke state
  setInfectiousProtocolConfirmed(true);
  // ...
};
```

---

## 🎯 NEXT STEPS (Optional Enhancements)

1. **Email Notification untuk Admin**
   - Kirim email otomatis saat ada jenazah penyakit menular
   - Gunakan `MailApp.sendEmail()` di Apps Script

2. **Export PDF Dengan Watermark**
   - Tandai dokumen penyakit menular dengan watermark merah
   - "PENYAKIT MENULAR - PROTOKOL KHUSUS"

3. **Dashboard Analytics**
   - Chart jumlah jenazah penyakit menular per bulan
   - Filter cepat untuk kasus menular di Admin Dashboard

4. **Multi-Language Support**
   - Terjemahan dialog ke bahasa Inggris
   - Toggle language di settings

5. **Advanced Validation**
   - Check duplikasi berdasarkan NIK + tanggal
   - Warning jika lokasi yang sama dalam 24 jam

---

## 📞 SUPPORT

**Dokumentasi Terkait:**
- `/PANDUAN_SETUP_LENGKAP.md` - Setup Google Sheets
- `/CHECKLIST_SETUP.md` - Checklist setup
- `/FAQ_GOOGLE_SHEETS.md` - FAQ troubleshooting

**File Kode:**
- `/src/app/components/InfectiousDiseaseAlert.tsx` - Dialog component
- `/src/app/pages/DataCollectionForm.tsx` - Form utama
- `/google-apps-script-validation-example.js` - Validasi backend

---

**✅ Fitur Jenazah Penyakit Menular sudah SIAP digunakan!**

**🚀 Tingkatkan keamanan dan compliance dengan protokol kesehatan!**
