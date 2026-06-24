# 🔐 FITUR VALIDASI NIK (Nomor Induk Kependudukan)

## 📋 OVERVIEW

Implementasi sistem validasi NIK yang comprehensive untuk memastikan data identitas yang diinput atau hasil OCR memiliki format yang benar sesuai standar NIK Indonesia (16 digit).

**Tujuan:**
- ✅ Validasi format NIK secara real-time
- ✅ Ekstraksi informasi dari NIK (tanggal lahir, jenis kelamin, kode wilayah)
- ✅ Perlindungan hukum dan ketertiban administrasi
- ✅ Integrasi dengan OCR untuk deteksi NIK otomatis
- ✅ User experience yang baik dengan feedback visual

---

## 🏗️ STRUKTUR NIK INDONESIA

NIK terdiri dari **16 digit** dengan struktur sebagai berikut:

```
3 1 7 4 0 1 2 5 0 8 9 0 0 0 0 1
└─┬─┘ └─┬─┘ └─┬─┘ └───┬───┘ └─┬─┘
  │     │     │       │       │
  │     │     │       │       └─ Nomor urut (0001-9999)
  │     │     │       └───────── Tahun lahir (90 = 1990)
  │     │     └───────────────── Bulan lahir (08 = Agustus)
  │     └─────────────────────── Tanggal lahir (25)
  │                               [+40 untuk perempuan = 65]
  └───────────────────────────── Kode wilayah
```

### **Breakdown:**

| Posisi | Digit | Keterangan | Contoh |
|--------|-------|------------|--------|
| 1-2 | `31` | Provinsi (DKI Jakarta) | 31 |
| 3-4 | `74` | Kabupaten/Kota (Jakarta Selatan) | 74 |
| 5-6 | `01` | Kecamatan (Tebet) | 01 |
| 7-8 | `25` atau `65` | Tanggal lahir (25 = Laki-laki, 65 = Perempuan) | 25 |
| 9-10 | `08` | Bulan lahir (Agustus) | 08 |
| 11-12 | `90` | Tahun lahir (1990) | 90 |
| 13-16 | `0001` | Nomor urut | 0001 |

**Catatan Penting:**
- Untuk **perempuan**, tanggal lahir ditambah **40**
  - Contoh: Lahir tanggal 15 → NIK: **55** (15 + 40)
  - Contoh: Lahir tanggal 8 → NIK: **48** (8 + 40)

---

## 📁 FILE YANG DIBUAT

### **1. `/src/app/utils/nikValidator.ts`**

**Utility functions untuk validasi dan manipulasi NIK.**

#### **Functions:**

##### ✅ `validateNIKFormat(nik: string): NIKValidationResult`

Validasi format NIK lengkap dengan ekstraksi data.

```typescript
const result = validateNIKFormat('3174012508900001');

// Result:
{
  isValid: true,
  details: {
    provinsi: '31',
    kabupatenKota: '74',
    kecamatan: '01',
    tanggalLahir: '25/08/1990',
    jenisKelamin: 'Laki-laki',
    tahunLahir: 1990
  }
}
```

**Validasi yang dilakukan:**
- ✅ NIK tidak boleh kosong
- ✅ Hanya berisi angka
- ✅ Panjang tepat 16 digit
- ✅ Tanggal lahir valid (1-31)
- ✅ Bulan lahir valid (1-12)
- ✅ Tahun lahir wajar (tidak dari masa depan, tidak > 150 tahun)
- ✅ Format tanggal valid (cek kalender - tidak ada 30 Feb, dll)

---

##### 🎨 `formatNIKDisplay(nik: string): string`

Format NIK untuk tampilan yang lebih mudah dibaca.

```typescript
formatNIKDisplay('3174012508900001');
// Output: "31.7401.250890.0001"
```

---

##### 🧹 `cleanNIK(nik: string): string`

Hapus semua karakter non-digit dari NIK.

```typescript
cleanNIK('31.7401.250890.0001');
// Output: "3174012508900001"

cleanNIK('3174 0125 0890 0001');
// Output: "3174012508900001"
```

---

##### ⌨️ `autoFormatNIK(value: string): string`

Auto-format NIK saat user mengetik (real-time formatting).

```typescript
// User types: "3174012508900001"
// Display:     "31.7401.250890.0001"

autoFormatNIK('31740125');
// Output: "31.7401.25"
```

---

##### 📊 `getNIKInfo(nik: string): string`

Get ringkasan informasi NIK untuk display.

```typescript
getNIKInfo('3174012508900001');
// Output: "Laki-laki • Lahir: 25/08/1990"

getNIKInfo('3174016508900001');
// Output: "Perempuan • Lahir: 25/08/1990"
```

---

##### 🔒 `maskNIK(nik: string): string`

Mask NIK untuk privacy (hanya tampilkan 6 digit pertama dan 4 digit terakhir).

```typescript
maskNIK('3174012508900001');
// Output: "317401******0001"
```

---

##### 🔍 `validateNIKFromOCR(ocrText: string): { nik: string | null; confidence: 'high' | 'medium' | 'low' }`

Validasi NIK dari hasil OCR dengan confidence level.

```typescript
const ocrText = "PROVINSI DKI JAKARTA\nNIK: 3174012508900001\nNAMA: BUDI SANTOSO";
const result = validateNIKFromOCR(ocrText);

// Result:
{
  nik: '3174012508900001',
  confidence: 'high' // NIK valid
}
```

**Confidence Levels:**
- `high`: NIK ditemukan dan format valid
- `medium`: NIK ditemukan tapi validasi gagal
- `low`: NIK tidak ditemukan

---

##### 🔄 `compareNIK(nik1: string, nik2: string): boolean`

Bandingkan dua NIK (toleran terhadap format).

```typescript
compareNIK('3174012508900001', '31.7401.250890.0001');
// Output: true

compareNIK('31 7401 250890 0001', '3174012508900001');
// Output: true
```

---

### **2. `/src/app/components/NIKInput.tsx`**

**React component untuk input NIK dengan validasi real-time.**

#### **Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | Nilai NIK (required) |
| `onChange` | `(value: string) => void` | - | Callback saat nilai berubah (required) |
| `label` | `string` | `'NIK (Nomor Induk Kependudukan)'` | Label input |
| `placeholder` | `string` | `'Masukkan 16 digit NIK'` | Placeholder text |
| `required` | `boolean` | `true` | Apakah field required |
| `disabled` | `boolean` | `false` | Disabled state |
| `showValidation` | `boolean` | `true` | Tampilkan validasi visual |
| `showDetails` | `boolean` | `true` | Tampilkan detail NIK (jenis kelamin, tanggal lahir) |
| `className` | `string` | `''` | Custom className |
| `autoFormat` | `boolean` | `true` | Auto-format dengan dots (XX.XXXX.XXXXXX.XXXX) |

#### **Features:**

✅ **Real-time Validation**
- Validasi saat user mengetik
- Visual feedback (green = valid, red = invalid, yellow = belum validasi)

✅ **Auto-formatting**
- Format otomatis: `31.7401.250890.0001`
- Atau plain: `3174012508900001`

✅ **Information Display**
- Jenis kelamin (Laki-laki/Perempuan)
- Tanggal lahir
- Kode wilayah

✅ **Error Messages**
- Pesan error spesifik untuk setiap validasi
- User-friendly language

✅ **Icons & Badges**
- ✅ CheckCircle untuk valid
- ❌ XCircle untuk invalid
- ⚠️ AlertCircle untuk belum tervalidasi
- Badge "Valid" saat NIK benar

#### **Usage Example:**

```tsx
import { NIKInput } from './components/NIKInput';

function MyForm() {
  const [nik, setNik] = useState('');

  return (
    <NIKInput
      value={nik}
      onChange={setNik}
      label="NIK Pemohon"
      placeholder="Contoh: 3174012508900001"
      required
      showValidation
      showDetails
      autoFormat
    />
  );
}
```

#### **Visual States:**

**1. Empty State:**
```
┌─────────────────────────────────────────┐
│ NIK (Nomor Induk Kependudukan) *        │
│ ┌─────────────────────────────────────┐ │
│ │ Masukkan 16 digit NIK               │ │
│ └─────────────────────────────────────┘ │
│ ℹ️ Format: XX.XXXX.XXXXXX.XXXX          │
│    (akan diformat otomatis)             │
└─────────────────────────────────────────┘
```

**2. Typing (Incomplete):**
```
┌─────────────────────────────────────────┐
│ NIK (Nomor Induk Kependudukan) *        │
│ ┌─────────────────────────────────────┐ │
│ │ 31.7401.25                      ⚠️  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**3. Valid NIK:**
```
┌─────────────────────────────────────────┐
│ NIK (Nomor Induk Kependudukan) * [✅ Valid]│
│ ┌─────────────────────────────────────┐ │
│ │ 31.7401.250890.0001             ✅  │ │ (Green border)
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ✅ NIK Valid                        │ │ (Green box)
│ │                                     │ │
│ │ 👤 Jenis Kelamin    📅 Tanggal Lahir│ │
│ │    Laki-laki           25/08/1990   │ │
│ │                                     │ │
│ │ Kode Wilayah: 31.74.01              │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**4. Invalid NIK:**
```
┌─────────────────────────────────────────┐
│ NIK (Nomor Induk Kependudukan) *        │
│ ┌─────────────────────────────────────┐ │
│ │ 12.3456.789012.3456             ❌  │ │ (Red border)
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ❌ NIK tidak valid                  │ │ (Red box)
│ │    Tanggal lahir tidak valid (34)   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔄 INTEGRASI DENGAN OCR

### **DataCollectionForm.tsx Updates**

OCR sekarang menggunakan validasi NIK yang lebih robust:

#### **Before:**
```typescript
// Simple regex match
const nikMatch = text.match(/\b\d{16}\b/);
if (nikMatch) {
  ocrData.nik = nikMatch[0];
}
```

#### **After:**
```typescript
// Enhanced validation with confidence level
const nikResult = validateNIKFromOCR(text);
if (nikResult.nik) {
  ocrData.nik = nikResult.nik;
  
  // Extract additional info from NIK
  const validation = validateNIKFormat(nikResult.nik);
  if (validation.isValid && validation.details) {
    ocrData.tanggalLahir = validation.details.tanggalLahir;
    ocrData.jenisKelamin = validation.details.jenisKelamin;
  }
}

// Try to find name
const namaMatch = text.match(/(?:Nama|NAMA)[:\s]*([A-Z\s]+)/i);
if (namaMatch && namaMatch[1]) {
  ocrData.nama = namaMatch[1].trim();
}
```

#### **Enhanced Toast Messages:**

```typescript
const nikValidation = nikResult.nik ? validateNIKFormat(nikResult.nik) : null;
toast.success(`Dokumen ${currentDocType} berhasil dipindai!`, {
  description: nikResult.nik 
    ? `NIK terdeteksi: ${nikResult.nik}${nikValidation?.isValid ? ' ✓ Valid' : ' ⚠️ Perlu verifikasi'}`
    : 'OCR selesai - NIK tidak terdeteksi'
});
```

---

### **DataContext.tsx Updates**

Validasi NIK sebelum submit ke backend:

```typescript
const addServiceUser = async (userData) => {
  // Validate NIK before submitting
  const nikValidation = validateNIKFormat(userData.nik);
  if (!nikValidation.isValid) {
    toast.error('NIK tidak valid', {
      description: nikValidation.error || 'Pastikan NIK terdiri dari 16 digit angka yang benar',
    });
    return; // Stop submission
  }

  // Proceed with submission...
}
```

---

## 📊 VALIDATION RULES

### **Format Rules:**

| Rule | Description | Example Error |
|------|-------------|---------------|
| **Not Empty** | NIK harus diisi | "NIK tidak boleh kosong" |
| **Numeric Only** | Hanya angka 0-9 | "NIK hanya boleh berisi angka" |
| **Exactly 16 Digits** | Tidak boleh kurang atau lebih | "NIK harus 16 digit (saat ini: 15 digit)" |
| **Valid Date** | Tanggal 1-31 | "Tanggal lahir tidak valid (34)" |
| **Valid Month** | Bulan 1-12 | "Bulan lahir tidak valid (13)" |
| **Valid Year** | Tahun wajar | "Usia tidak wajar (200 tahun)" |
| **Not Future Date** | Tidak dari masa depan | "Tanggal lahir tidak boleh di masa depan" |
| **Valid Calendar** | Tanggal sesuai kalender | "Tanggal 30/02/1990 tidak valid" |

### **Date Validation Examples:**

```typescript
// ✅ VALID
validateNIKFormat('3174012508900001'); // 25/08/1990
validateNIKFormat('3174016508900001'); // 25/08/1990 (Perempuan)
validateNIKFormat('3174010101250001'); // 01/01/2025

// ❌ INVALID
validateNIKFormat('3174013508900001'); // Tanggal 35 tidak ada
validateNIKFormat('3174012090900001'); // Bulan 20 tidak ada
validateNIKFormat('3174013002900001'); // 30 Februari tidak ada
validateNIKFormat('3174010110500001'); // Tahun 2105 (masa depan)
```

---

## 🎨 UI/UX IMPROVEMENTS

### **Visual Feedback:**

| State | Border Color | Icon | Message |
|-------|-------------|------|---------|
| **Empty** | Default gray | None | Helper text |
| **Typing** | Yellow | ⚠️ Alert | No message |
| **Valid** | Green | ✅ Check | Success box with details |
| **Invalid** | Red | ❌ Cross | Error box with reason |

### **Accessibility:**

✅ **ARIA Labels:**
- `aria-invalid` untuk screen readers
- `aria-describedby` menghubungkan dengan error message

✅ **Keyboard Navigation:**
- Tab untuk focus
- Input type="text" untuk mobile keyboard

✅ **Color Contrast:**
- Green: `#22c55e` (WCAG AA compliant)
- Red: `#ef4444` (WCAG AA compliant)
- Yellow: `#eab308` (WCAG AA compliant)

✅ **Touch-Friendly:**
- Input height cukup untuk tap
- Clear visual feedback

---

## 🧪 TESTING SCENARIOS

### **Manual Test Cases:**

| Test Case | Input | Expected Result |
|-----------|-------|----------------|
| **Valid Male** | `3174012508900001` | ✅ Valid - Laki-laki, 25/08/1990 |
| **Valid Female** | `3174016508900001` | ✅ Valid - Perempuan, 25/08/1990 |
| **Short NIK** | `317401250890` | ❌ NIK harus 16 digit (saat ini: 12 digit) |
| **Long NIK** | `31740125089000012345` | Auto-truncated to 16 digits |
| **With Letters** | `317A012508900001` | ❌ NIK hanya boleh berisi angka |
| **Invalid Date** | `3174013508900001` | ❌ Tanggal lahir tidak valid (35) |
| **Invalid Month** | `3174012090900001` | ❌ Bulan lahir tidak valid (20) |
| **Future Date** | `3174010110500001` | ❌ Tanggal lahir tidak boleh di masa depan |
| **Feb 30** | `3174013002900001` | ❌ Tanggal 30/02/1990 tidak valid |

### **OCR Test Cases:**

| OCR Text | Expected NIK | Confidence |
|----------|-------------|-----------|
| `"NIK: 3174012508900001 NAMA: BUDI"` | `3174012508900001` | `high` |
| `"3174012508900001"` | `3174012508900001` | `high` |
| `"NIK 317401250890"` | `null` | `low` |
| `"1234567890123456"` | `1234567890123456` | `medium` |

---

## 📱 RESPONSIVE DESIGN

### **Mobile:**
- Font size: `text-sm` (14px)
- Input height: `h-10` (40px) - touch-friendly
- Stack information vertically
- Full-width layout

### **Desktop:**
- Font size: `text-base` (16px)
- Grid layout for information display
- Side-by-side validation messages

---

## 🔐 SECURITY & PRIVACY

### **Data Protection:**

✅ **Masking for Display:**
```typescript
// For public display or logs
const maskedNIK = maskNIK('3174012508900001');
// Output: "317401******0001"
```

✅ **Validation Only:**
- NIK tidak dikirim ke external service untuk validasi
- Validasi dilakukan client-side
- Privacy terjaga

✅ **No Storage of Invalid NIK:**
- Hanya NIK yang valid yang disimpan ke database
- Mencegah data sampah

---

## 🚀 USAGE IN APPLICATION

### **1. DataCollectionForm:**

```tsx
import { NIKInput } from '../components/NIKInput';

<NIKInput
  value={nik}
  onChange={setNik}
  required
  showValidation
  showDetails
  autoFormat
/>
```

### **2. Admin Verification:**

```tsx
// Display masked NIK for privacy
<p>NIK: {maskNIK(user.nik)}</p>

// Or formatted for clarity
<p>NIK: {formatNIKDisplay(user.nik)}</p>
```

### **3. OCR Result Display:**

```tsx
{doc.ocrData?.nik && (
  <div>
    <p>NIK: {doc.ocrData.nik}</p>
    <p>{getNIKInfo(doc.ocrData.nik)}</p>
    {/* Output: "Laki-laki • Lahir: 25/08/1990" */}
  </div>
)}
```

---

## 📚 ERROR MESSAGES (Indonesian)

Semua error message dalam Bahasa Indonesia yang user-friendly:

| Error | Message |
|-------|---------|
| Empty | "NIK tidak boleh kosong" |
| Non-numeric | "NIK hanya boleh berisi angka" |
| Wrong length | "NIK harus 16 digit (saat ini: X digit)" |
| Invalid date | "Tanggal lahir tidak valid (XX)" |
| Invalid month | "Bulan lahir tidak valid (XX)" |
| Future date | "Tanggal lahir tidak boleh di masa depan" |
| Invalid calendar | "Tanggal XX/XX/XXXX tidak valid" |
| Too old | "Usia tidak wajar (XXX tahun)" |

---

## 🎯 BENEFITS

### **For Users (Petugas):**
✅ **Real-time Feedback** - Tahu langsung jika NIK salah
✅ **Auto-correction** - Format otomatis, tidak perlu manual
✅ **Information Display** - Lihat jenis kelamin dan tanggal lahir langsung
✅ **Error Prevention** - Tidak bisa submit data invalid

### **For Admin:**
✅ **Data Quality** - Semua NIK dijamin valid
✅ **Legal Protection** - Dokumentasi yang benar dan lengkap
✅ **Easy Verification** - Info tambahan memudahkan cross-check
✅ **Audit Trail** - Confidence level dari OCR

### **For System:**
✅ **Database Integrity** - Hanya data valid yang masuk
✅ **API Integration** - Format konsisten untuk external APIs
✅ **Searchability** - Format standar mudah dicari
✅ **Analytics** - Data bersih untuk reporting

---

## 🔄 FUTURE ENHANCEMENTS

### **Possible Improvements:**

1. **Server-side Validation:**
   ```typescript
   // Validate against real government database
   const isRealNIK = await validateNIKWithDukcapil(nik);
   ```

2. **NIK Suggestions:**
   ```typescript
   // Suggest corrections for common typos
   const suggestions = suggestNIKCorrections('317401250890001'); // 15 digits
   // Returns: ['3174012508900001']
   ```

3. **Barcode/QR Scanner:**
   ```typescript
   // Scan NIK from e-KTP QR code
   const nik = await scanQRCode();
   ```

4. **Offline Cache:**
   ```typescript
   // Cache kode wilayah untuk offline lookup
   const wilayahName = getWilayahName('31.74.01');
   // Returns: "DKI Jakarta - Jakarta Selatan - Tebet"
   ```

5. **Analytics Dashboard:**
   ```typescript
   // Track NIK validation success rate
   const stats = {
     totalScans: 100,
     validNIK: 85,
     invalidNIK: 15,
     ocrAccuracy: 85%
   };
   ```

---

## 📝 FILES SUMMARY

### **New Files Created:**
1. `/src/app/utils/nikValidator.ts` - Utility functions
2. `/src/app/components/NIKInput.tsx` - React component
3. `/FITUR_VALIDASI_NIK.md` - This documentation

### **Modified Files:**
1. `/src/app/context/DataContext.tsx` - Added NIK validation before submit
2. `/src/app/pages/DataCollectionForm.tsx` - Enhanced OCR with NIK validation

---

## ✅ CHECKLIST IMPLEMENTATION

- [x] Create NIK validator utility functions
- [x] Create NIKInput React component
- [x] Integrate with DataContext for submission validation
- [x] Integrate with OCR for automatic NIK detection
- [x] Enhanced OCR with name extraction
- [x] Add validation feedback in toast messages
- [x] Support auto-formatting
- [x] Support masking for privacy
- [x] Add comprehensive error messages
- [x] Dark mode support
- [x] Responsive design
- [x] Accessibility (ARIA labels)
- [x] Documentation

---

**✅ FITUR VALIDASI NIK SELESAI!**

**NIK sekarang:**
- 🔍 Tervalidasi secara real-time
- ✅ Format otomatis dengan dots
- 📊 Ekstraksi info (jenis kelamin, tanggal lahir)
- 🎨 Visual feedback yang jelas
- 🔐 Privacy-aware (masking tersedia)
- 🤖 Integrasi dengan OCR
- 📱 Responsive dan accessible
- 🇮🇩 Bahasa Indonesia yang user-friendly
