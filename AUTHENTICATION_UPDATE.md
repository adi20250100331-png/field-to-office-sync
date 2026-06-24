# Update Autentikasi - WhatsApp Integration

## ⚠️ PERUBAHAN PENTING

Aplikasi ini telah diubah dari **self-service** menjadi **admin-managed** untuk keamanan.

---

## ❌ Fitur yang DIHAPUS

### 1. Google Sign In
**Alasan**: Aplikasi hanya untuk petugas terdaftar, bukan untuk publik

**Sebelumnya**: 
- Button "Masuk dengan Google"
- Auto-create akun dari Google account

**Sekarang**: 
- ❌ Dihapus
- ✅ Diganti dengan WhatsApp untuk kontak admin

---

### 2. Halaman Registrasi Publik
**Alasan**: Hanya admin yang bisa mendaftarkan petugas baru

**Sebelumnya**:
- Route `/register`
- Form self-registration
- User bisa daftar sendiri

**Sekarang**:
- ❌ Route `/register` dihapus
- ✅ Link "Belum punya akun? Hubungi Admin via WhatsApp"

---

## ✅ Fitur BARU - WhatsApp Integration

### 1. Login Petugas - Kontak Admin
**Lokasi**: `/field-officer/login`

**Tampilan**:
```
┌─────────────────────────────────────┐
│  [Username Field]                   │
│  [Password Field]                   │
│  [Tidak dapat mengakses akun?]      │
│  [Button: MASUK]                    │
│                                     │
│  ────── Belum punya akun? ──────   │
│                                     │
│  [🟢 Hubungi Admin via WhatsApp]   │
│  Hanya petugas terdaftar yang...   │
└─────────────────────────────────────┘
```

**Fungsi**:
- Klik button hijau WhatsApp
- Otomatis buka WhatsApp ke nomor admin
- Chat pre-filled dengan pesan:
  ```
  Halo Admin, saya ingin mendaftar sebagai petugas lapangan 
  di aplikasi Field-to-Office Sync.
  ```

---

### 2. Login Admin - Kontak Super Admin
**Lokasi**: `/admin/login`

**Tampilan**:
```
┌─────────────────────────────────────┐
│  [Username Field]                   │
│  [Password Field]                   │
│  [📱 Lupa password?]                │
│  [Button: MASUK SEBAGAI ADMIN]      │
└─────────────────────────────────────┘
```

**Fungsi**:
- Klik link "Lupa password?"
- Otomatis buka WhatsApp ke nomor super admin
- Chat pre-filled dengan pesan:
  ```
  Halo Super Admin, saya membutuhkan bantuan untuk mengakses 
  akun admin saya di aplikasi Field-to-Office Sync.
  ```

---

### 3. Recovery Page - Bantuan Admin
**Lokasi**: `/recovery`

**Fungsi Tambahan**:
- Section "Butuh bantuan lebih lanjut?"
- Button "Hubungi Admin via WhatsApp"
- Mengarah ke admin untuk bantuan personal

---

## 🔧 Konfigurasi Nomor WhatsApp

### File yang Perlu Diubah:

#### 1. `/src/app/pages/LoginPage.tsx`
```typescript
// Line 11-12
// Nomor WhatsApp Admin (format internasional tanpa +)
const ADMIN_WHATSAPP = '6285237058348'; // ⚠️ GANTI INI
```

#### 2. `/src/app/pages/AdminLoginPage.tsx`
```typescript
// Line 12-13
// Nomor WhatsApp Super Admin (format internasional tanpa +)
const SUPER_ADMIN_WHATSAPP = '6285237058348'; // ⚠️ GANTI INI
```

#### 3. `/src/app/pages/RecoveryPage.tsx`
```typescript
// Line 12-13
// Nomor WhatsApp Admin (format internasional tanpa +)
const ADMIN_WHATSAPP = '6285237058348'; // ⚠️ GANTI INI
```

### Format Nomor:
- ✅ Benar: `628523705834` (kode negara + nomor tanpa 0)
- ❌ Salah: `+6285237058348` (ada +)
- ❌ Salah: `085237058348` (tidak ada kode negara)

**Contoh Konversi**:
- Nomor: `0852-3705-8348`
- WhatsApp: `6285237058348`

---

## 📋 SOP Pendaftaran Petugas Baru

### Alur Proses:

```
1. Calon Petugas
   ↓
   Klik "Hubungi Admin via WhatsApp"
   ↓
2. Chat WhatsApp ke Admin
   ↓
   Kirim identitas & dokumen pendukung
   ↓
3. Admin Verifikasi
   ↓
   Cek identitas, surat tugas, dll
   ↓
4. Admin Buat Akun
   ↓
   Input ke database/Google Sheets
   ↓
5. Admin Kirim Kredensial
   ↓
   Via WhatsApp (username + password)
   ↓
6. Petugas Login
   ↓
   Pakai kredensial dari admin
```

### Data yang Diminta dari Calon Petugas:
```
- Nama Lengkap
- NIK
- Email
- No. Telepon
- Foto KTP
- Surat Tugas/SK Pengangkatan
- Area Penugasan
```

### Template Pesan Admin ke Petugas Baru:
```
✅ Akun Anda telah dibuat!

Username: [username]
Password: [password]

Link aplikasi: [URL]

PENTING:
1. Jangan bagikan kredensial ke orang lain
2. Hubungi admin jika lupa password
3. Segera login dan mulai input data

Terima kasih
Admin Kemenkes
```

---

## 🛡️ Keamanan & Kebijakan

### Keuntungan Sistem Baru:

✅ **Kontrol Penuh**
- Admin tahu siapa saja yang punya akses
- Tidak ada akun unauthorized

✅ **Verifikasi Identitas**
- Setiap petugas diverifikasi sebelum diberi akun
- Mengurangi risiko penyalahgunaan

✅ **Audit Trail**
- Admin punya record semua pendaftaran
- Mudah tracking siapa yang mendaftar kapan

✅ **No Public Exposure**
- Aplikasi tidak muncul di Google Search
- Hanya yang punya link + akun bisa akses

### Password Policy:
- Minimal 8 karakter
- Kombinasi huruf besar, kecil, angka
- Tidak menggunakan data pribadi (tanggal lahir, nama, dll)
- Ganti password secara berkala

---

## 🔄 Migrasi dari Sistem Lama

Jika sebelumnya ada user yang self-register:

### Langkah Migrasi:
1. **Export Data User**
   - Export semua user dari database
   - Buat list email/kontak mereka

2. **Kirim Notifikasi**
   ```
   [PENTING] Perubahan Sistem Login
   
   Mulai [TANGGAL], sistem pendaftaran berubah:
   - Tidak ada lagi registrasi mandiri
   - Semua akun baru melalui admin
   - Akun lama Anda tetap aktif
   
   Jika lupa password:
   Hubungi admin via WhatsApp: [NOMOR]
   
   Terima kasih
   Tim Kemenkes
   ```

3. **Review & Cleanup**
   - Review akun yang tidak aktif
   - Hapus akun duplikat
   - Verifikasi ulang jika perlu

---

## 📞 Dukungan & Kontak

### Nomor Penting:
| Role | Nomor WhatsApp | Untuk |
|------|----------------|-------|
| Admin Petugas | [ISI NOMOR] | Pendaftaran petugas baru |
| Super Admin | [ISI NOMOR] | Reset password admin |
| IT Support | [ISI NOMOR] | Masalah teknis |

### Jam Operasional:
- Senin - Jumat: 08.00 - 16.00 WIT
- Sabtu: 08.00 - 12.00 WIT
- Minggu & Libur: Closed

### Response Time:
- Normal: 1-2 jam kerja
- Urgent: 15-30 menit (jam kerja)
- Di luar jam kerja: Next business day

---

## 📝 Checklist Implementasi

### Untuk Admin:
- [ ] Update nomor WhatsApp di 3 file
- [ ] Test button WhatsApp (klik & pastikan buka chat yang benar)
- [ ] Siapkan template response untuk calon petugas
- [ ] Buat form verifikasi calon petugas
- [ ] Setup database/spreadsheet untuk tracking pendaftaran
- [ ] Buat SOP detail untuk tim admin
- [ ] Training tim admin tentang proses verifikasi

### Untuk IT:
- [ ] Deploy versi terbaru aplikasi
- [ ] Hapus route `/register` dari server
- [ ] Update dokumentasi
- [ ] Inform semua stakeholder tentang perubahan
- [ ] Monitor log untuk error terkait WhatsApp integration
- [ ] Setup analytics untuk track penggunaan button WhatsApp

### Untuk User Existing:
- [ ] Kirim notifikasi perubahan sistem
- [ ] Provide contact admin untuk bantuan
- [ ] Grace period untuk adaptasi (1-2 minggu)

---

## ✨ Kesimpulan

Perubahan ini meningkatkan keamanan dan kontrol aplikasi dengan:
- ❌ Menghapus self-registration
- ❌ Menghapus Google Sign In
- ✅ Menambah WhatsApp integration
- ✅ Admin-managed user registration
- ✅ Better verification process

Untuk pertanyaan lebih lanjut, lihat `/WHATSAPP_ADMIN_SETUP.md`
