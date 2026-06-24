# ⚡ QUICK REFERENCE - FITUR PENYAKIT MENULAR

## 🎯 IMPLEMENTASI 5 MENIT

### 1. Component Sudah Dibuat ✅
```bash
/src/app/components/InfectiousDiseaseAlert.tsx
```

### 2. Form Sudah Diupdate ✅
```bash
/src/app/pages/DataCollectionForm.tsx
```

### 3. Testing Lokal

```bash
# Run development server
npm run dev

# Buka browser
http://localhost:5173/data-collection

# Test steps:
1. Isi form sampai Step 2 (Dokumen)
2. Scroll ke bawah
3. Centang "⚠️ Jenazah Penyakit Menular"
4. Dialog muncul → Klik "SAYA PAHAM & PATUH"
5. Lanjut ke step berikutnya
6. Submit form
```

---

## 📊 DATA STRUCTURE

### State Variables:
```typescript
jenazahPenyakitMenular: boolean
showInfectiousAlert: boolean
infectiousProtocolConfirmed: boolean
infectiousProtocolTimestamp: string | null
isSubmitting: boolean
```

### Form Data Output:
```javascript
{
  keterangan: "Kesimpulan: MEMENUHI SYARAT. Pengantar: Ahmad. Pemeriksa: Dr. Budi. [JENAZAH PENYAKIT MENULAR - Protokol Dikonfirmasi pada 05/03/2026 14:30:00]"
}
```

---

## 🎨 UI COMPONENTS LOCATION

**Checkbox:**
Line ~763 di DataCollectionForm.tsx
```typescript
<Checkbox 
  id="jenazahPenyakitMenular" 
  checked={jenazahPenyakitMenular}
  onCheckedChange={handleInfectiousDiseaseToggle}
/>
```

**Dialog:**
Line ~1557 di DataCollectionForm.tsx
```typescript
<InfectiousDiseaseAlert
  open={showInfectiousAlert}
  onConfirm={handleInfectiousProtocolConfirm}
  onCancel={handleInfectiousProtocolCancel}
  variant="warning"
/>
```

**Submit Button:**
Line ~1288 di DataCollectionForm.tsx
```typescript
<Button
  onClick={handleSubmit}
  disabled={isSubmitting}
>
  {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
</Button>
```

---

## 🔒 VALIDASI CHECKLIST

```typescript
✅ waktuTempat.hari
✅ waktuTempat.tanggal  
✅ waktuTempat.jam
✅ waktuTempat.lokasi
✅ hasDokumen (minimal 1)
✅ kesimpulan
✅ infectiousProtocolConfirmed (jika jenazahPenyakitMenular)
✅ namaPengantar
✅ namaPemeriksa
```

---

## 🚨 CRITICAL FUNCTIONS

### handleInfectiousDiseaseToggle()
```typescript
// Trigger: Checkbox di-centang
// Action: Show alert dialog
// Location: Line ~98 DataCollectionForm.tsx
```

### handleInfectiousProtocolConfirm()
```typescript
// Trigger: User klik "SAYA PAHAM & PATUH"
// Action: 
//   1. Set jenazahPenyakitMenular = true
//   2. Set infectiousProtocolConfirmed = true
//   3. Save timestamp
//   4. Close dialog
//   5. Show success toast
// Location: Line ~108 DataCollectionForm.tsx
```

### handleSubmit()
```typescript
// Trigger: User klik "Kirim Laporan"
// Action:
//   1. Validate all fields
//   2. Set isSubmitting = true
//   3. Save data (with infectious flag if applicable)
//   4. Navigate to dashboard
// Location: Line ~435 DataCollectionForm.tsx
```

---

## 🎨 STYLING TOKENS

### Colors:
```css
/* Warning */
bg-red-50, border-red-500, text-red-600
from-red-600 to-red-700

/* Checklist */
bg-amber-50, border-amber-400, text-amber-600
from-amber-500 to-amber-600

/* Success */
bg-green-600, text-green-700

/* Highlight */
from-red-500 via-amber-500 to-red-500
```

### Animations:
```css
animate-pulse  /* Icon warning */
animate-spin   /* Loading spinner */
```

---

## 🧪 TEST CASES

### Test 1: Happy Path
```
Input: Centang checkbox → Konfirmasi → Submit
Expected: ✅ Data tersimpan dengan flag penyakit menular
```

### Test 2: Cancel Protocol
```
Input: Centang checkbox → Batalkan
Expected: ✅ Checkbox unchecked, no flag saved
```

### Test 3: Validation Error
```
Input: Centang checkbox → TIDAK konfirmasi → Submit
Expected: ❌ Error toast: "Protokol Belum Dikonfirmasi"
```

### Test 4: Uncheck After Confirm
```
Input: Centang → Konfirmasi → Uncheck
Expected: ✅ Flag & timestamp di-reset
```

---

## 📦 DEPENDENCIES

```json
{
  "@radix-ui/react-alert-dialog": "^1.x",
  "lucide-react": "^0.x",
  "sonner": "^1.x"
}
```

---

## 🔗 INTEGRATION POINTS

### Frontend → Backend:
```javascript
// Kirim data penyakit menular
addServiceUser({
  ...formData,
  keterangan: "... [JENAZAH PENYAKIT MENULAR - ...]",
  documents,
  status: 'pending'
});
```

### Backend (Google Sheets):
```javascript
// Simpan ke sheet ServiceUsers
{
  jenazah_penyakit_menular: true,
  infectious_protocol_confirmed: true,
  infectious_protocol_timestamp: "2026-03-05T14:30:00.000Z"
}
```

---

## 🎯 CUSTOMIZATION OPTIONS

### Change Dialog Variant:
```typescript
// Di DataCollectionForm.tsx line ~1557
<InfectiousDiseaseAlert
  variant="checklist"  // Ganti dari "warning"
/>
```

### Change Button Text:
```typescript
// Di InfectiousDiseaseAlert.tsx
// Line ~62 (warning) atau line ~102 (checklist)
```

### Change Colors:
```typescript
// Di InfectiousDiseaseAlert.tsx
// Update className di AlertDialogContent
bg-gradient-to-br from-red-50 ...
→ Ganti dengan warna custom
```

---

## 🐛 COMMON ERRORS & FIXES

| Error | Fix |
|-------|-----|
| Dialog tidak muncul | Check import InfectiousDiseaseAlert |
| Loading stuck | Add `setIsSubmitting(false)` di catch block |
| Timestamp null | Check handleInfectiousProtocolConfirm() |
| Validasi tidak jalan | Ensure `return` after toast.error() |

---

## 📖 FILES REFERENCE

```
/src/app/components/
  └── InfectiousDiseaseAlert.tsx          ← Dialog component

/src/app/pages/
  └── DataCollectionForm.tsx              ← Main form

/
  ├── google-apps-script-validation-example.js  ← Backend validation
  ├── PANDUAN_FITUR_PENYAKIT_MENULAR.md         ← Full documentation
  └── QUICK_REFERENCE_PENYAKIT_MENULAR.md       ← This file
```

---

## ⚡ ONE-LINER COMMANDS

```bash
# Find all infectious disease related code
grep -r "infectious" src/

# Find validation logic
grep -r "validateForm" src/

# Find submit button
grep -r "isSubmitting" src/app/pages/DataCollectionForm.tsx

# Count lines of new code
wc -l src/app/components/InfectiousDiseaseAlert.tsx
```

---

## 🎓 CODE SNIPPETS

### Add Custom Toast:
```typescript
toast.success('Custom Message', {
  description: 'Custom description here'
});
```

### Add New Validation:
```typescript
if (yourCondition) {
  toast.error('Error Title', {
    description: 'Error detail'
  });
  return; // Stop execution
}
```

### Access Timestamp:
```typescript
{infectiousProtocolTimestamp && (
  <p>{new Date(infectiousProtocolTimestamp).toLocaleString('id-ID')}</p>
)}
```

---

**⚡ End of Quick Reference**

**📖 Full Documentation:** `/PANDUAN_FITUR_PENYAKIT_MENULAR.md`
