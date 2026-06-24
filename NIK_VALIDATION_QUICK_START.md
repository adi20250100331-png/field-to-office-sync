# 🚀 NIK Validation - Quick Start Guide

## 📦 Installation

Tidak perlu install package tambahan. Semua sudah tersedia di:
- `/src/app/utils/nikValidator.ts`
- `/src/app/components/NIKInput.tsx`

---

## 🎯 Basic Usage

### **1. Import NIKInput Component**

```tsx
import { NIKInput } from './components/NIKInput';
```

### **2. Use in Your Form**

```tsx
function MyForm() {
  const [nik, setNik] = useState('');

  return (
    <NIKInput
      value={nik}
      onChange={setNik}
      required
    />
  );
}
```

**That's it!** ✅ Validasi otomatis, formatting otomatis, error messages otomatis.

---

## 🛠️ Advanced Usage

### **With Custom Props**

```tsx
<NIKInput
  value={nik}
  onChange={setNik}
  label="NIK Pasien"
  placeholder="Masukkan 16 digit NIK"
  required={true}
  disabled={false}
  showValidation={true}    // Show green/red validation
  showDetails={true}       // Show jenis kelamin & tanggal lahir
  autoFormat={true}        // Auto-format with dots
  className="mb-4"
/>
```

---

## 🔧 Using Validator Functions

### **Validate NIK**

```tsx
import { validateNIKFormat } from '../utils/nikValidator';

const result = validateNIKFormat('3174012508900001');

if (result.isValid) {
  console.log('Valid NIK!');
  console.log('Jenis Kelamin:', result.details.jenisKelamin);
  console.log('Tanggal Lahir:', result.details.tanggalLahir);
} else {
  console.error('Invalid:', result.error);
}
```

### **Format for Display**

```tsx
import { formatNIKDisplay } from '../utils/nikValidator';

const formatted = formatNIKDisplay('3174012508900001');
// Output: "31.7401.250890.0001"
```

### **Mask for Privacy**

```tsx
import { maskNIK } from '../utils/nikValidator';

const masked = maskNIK('3174012508900001');
// Output: "317401******0001"
```

### **Get Info String**

```tsx
import { getNIKInfo } from '../utils/nikValidator';

const info = getNIKInfo('3174012508900001');
// Output: "Laki-laki • Lahir: 25/08/1990"
```

### **Clean NIK (for Database)**

```tsx
import { cleanNIK } from '../utils/nikValidator';

const clean = cleanNIK('31.7401.250890.0001');
// Output: "3174012508900001"
```

---

## 🤖 OCR Integration

### **Validate NIK from OCR Text**

```tsx
import { validateNIKFromOCR, validateNIKFormat } from '../utils/nikValidator';

const ocrText = "PROVINSI DKI JAKARTA\nNIK: 3174012508900001\nNAMA: BUDI";
const nikResult = validateNIKFromOCR(ocrText);

if (nikResult.nik) {
  const validation = validateNIKFormat(nikResult.nik);
  
  if (validation.isValid && validation.details) {
    console.log('NIK:', nikResult.nik);
    console.log('Tanggal Lahir:', validation.details.tanggalLahir);
    console.log('Jenis Kelamin:', validation.details.jenisKelamin);
  }
}
```

**Confidence Levels:**
- `high` - NIK ditemukan dan valid ✅
- `medium` - NIK ditemukan tapi validasi gagal ⚠️
- `low` - NIK tidak ditemukan ❌

---

## 💾 Before Saving to Database

```tsx
import { validateNIKFormat, cleanNIK } from '../utils/nikValidator';

const handleSubmit = async (formData) => {
  // 1. Clean the NIK
  const cleanedNIK = cleanNIK(formData.nik);
  
  // 2. Validate
  const validation = validateNIKFormat(cleanedNIK);
  
  if (!validation.isValid) {
    toast.error('NIK tidak valid', {
      description: validation.error
    });
    return;
  }
  
  // 3. Save to database
  await saveToDatabase({
    ...formData,
    nik: cleanedNIK  // Save as 16 digits, no formatting
  });
};
```

---

## 📊 Display NIK in UI

### **Public Display (Masked)**

```tsx
import { maskNIK } from '../utils/nikValidator';

<p>NIK: {maskNIK(user.nik)}</p>
// Shows: "317401******0001"
```

### **Admin Display (Formatted)**

```tsx
import { formatNIKDisplay, getNIKInfo } from '../utils/nikValidator';

<div>
  <p>NIK: {formatNIKDisplay(user.nik)}</p>
  <p className="text-sm text-gray-600">{getNIKInfo(user.nik)}</p>
</div>
// Shows:
// NIK: 31.7401.250890.0001
// Laki-laki • Lahir: 25/08/1990
```

---

## 🧪 Test NIK Examples

### **Valid NIKs:**

```typescript
// Laki-laki, lahir 25 Agustus 1990
'3174012508900001' ✅

// Perempuan, lahir 25 Agustus 1990 (25+40=65)
'3174016508900001' ✅

// Laki-laki, lahir 01 Januari 2025
'3174010101250001' ✅
```

### **Invalid NIKs:**

```typescript
// Too short
'317401250890' ❌

// Invalid date (35)
'3174013508900001' ❌

// Invalid month (20)
'3174012090900001' ❌

// Invalid calendar (30 Feb)
'3174013002900001' ❌

// Future date
'3174010110500001' ❌
```

---

## 🎨 Styling

### **Default (Auto-formatted with dots)**

```tsx
<NIKInput value={nik} onChange={setNik} />
// User types: 3174012508900001
// Displays: 31.7401.250890.0001
```

### **Plain (No formatting)**

```tsx
<NIKInput 
  value={nik} 
  onChange={setNik}
  autoFormat={false}
/>
// User types: 3174012508900001
// Displays: 3174012508900001
```

---

## 🔴 Error Handling

```tsx
const validation = validateNIKFormat(nik);

if (!validation.isValid) {
  switch (validation.error) {
    case 'NIK tidak boleh kosong':
      // Handle empty
      break;
    case 'NIK hanya boleh berisi angka':
      // Handle non-numeric
      break;
    default:
      // Handle other errors
      toast.error(validation.error);
  }
}
```

---

## 📱 Common Patterns

### **Pattern 1: Form Input**

```tsx
const [nik, setNik] = useState('');

<NIKInput
  value={nik}
  onChange={setNik}
  required
  showValidation
  showDetails
/>
```

### **Pattern 2: Display Only**

```tsx
<div>
  <Label>NIK</Label>
  <p className="font-mono">{formatNIKDisplay(user.nik)}</p>
  <p className="text-sm text-gray-600">{getNIKInfo(user.nik)}</p>
</div>
```

### **Pattern 3: OCR Result**

```tsx
const handleOCR = (ocrText: string) => {
  const nikResult = validateNIKFromOCR(ocrText);
  
  if (nikResult.nik) {
    setNik(nikResult.nik);
    
    toast.success('NIK terdeteksi!', {
      description: nikResult.confidence === 'high' 
        ? 'NIK valid ✅' 
        : 'Perlu verifikasi ⚠️'
    });
  } else {
    toast.warning('NIK tidak terdeteksi');
  }
};
```

### **Pattern 4: Comparison**

```tsx
import { compareNIK } from '../utils/nikValidator';

const isSamePerson = compareNIK(
  '31.7401.250890.0001',  // Formatted
  '3174012508900001'       // Plain
);
// Returns: true
```

---

## 🔑 All Available Functions

| Function | Input | Output | Use Case |
|----------|-------|--------|----------|
| `validateNIKFormat()` | `string` | `NIKValidationResult` | Full validation |
| `formatNIKDisplay()` | `string` | `string` | Display with dots |
| `cleanNIK()` | `string` | `string` | Remove formatting |
| `maskNIK()` | `string` | `string` | Privacy display |
| `getNIKInfo()` | `string` | `string` | Summary info |
| `autoFormatNIK()` | `string` | `string` | Real-time format |
| `validateNIKFromOCR()` | `string` | `{ nik, confidence }` | OCR extraction |
| `compareNIK()` | `string, string` | `boolean` | Comparison |

---

## 📚 Full Documentation

For complete documentation, see:
- `/FITUR_VALIDASI_NIK.md` - Comprehensive guide
- `/src/app/utils/nikValidator.ts` - Source code with comments
- `/src/app/components/NIKInput.tsx` - Component source
- `/src/app/components/NIKInputDemo.tsx` - Interactive demo

---

## ✅ Checklist for Implementation

When adding NIK to your form:

- [ ] Import `NIKInput` component
- [ ] Add state: `const [nik, setNik] = useState('')`
- [ ] Use `<NIKInput value={nik} onChange={setNik} />`
- [ ] Validate before submit: `validateNIKFormat(cleanNIK(nik))`
- [ ] Save cleaned NIK to DB: `cleanNIK(nik)`
- [ ] Display formatted: `formatNIKDisplay(nik)` or masked: `maskNIK(nik)`

---

## 🆘 Common Issues

### **Issue: NIK dengan format berbeda tidak cocok**

```tsx
// ❌ Wrong
if (nik === '31.7401.250890.0001') { ... }

// ✅ Correct
import { compareNIK } from '../utils/nikValidator';
if (compareNIK(nik, '3174012508900001')) { ... }
```

### **Issue: OCR tidak detect NIK**

```tsx
// Make sure NIK is 16 digits in OCR text
const ocrText = "NIK: 317401250890001"; // ❌ 15 digits
const ocrText = "NIK: 3174012508900001"; // ✅ 16 digits
```

### **Issue: Validation terlalu strict**

```tsx
// Use OCR validation for more lenient check
const result = validateNIKFromOCR(ocrText);
// Returns nik even if some validations fail (medium confidence)
```

---

## 🎓 Learning Resources

**NIK Structure Reference:**
```
Position  1-2: Province Code (31 = DKI Jakarta)
Position  3-4: City/Regency Code (74 = Jakarta Selatan)
Position  5-6: District Code (01 = Tebet)
Position  7-8: Birth Date (25 for male, 65 for female = 25+40)
Position 9-10: Birth Month (08 = August)
Position 11-12: Birth Year (90 = 1990)
Position 13-16: Sequence Number (0001-9999)
```

**Gender Detection:**
- Tanggal ≤ 31: Laki-laki
- Tanggal > 31: Perempuan (subtract 40 to get real date)

---

**Need help?** Check `/FITUR_VALIDASI_NIK.md` for detailed examples! 🚀
