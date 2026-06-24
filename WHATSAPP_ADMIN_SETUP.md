# Panduan Setup WhatsApp Admin

## 📱 Konfigurasi Nomor WhatsApp Admin

Aplikasi ini menggunakan WhatsApp sebagai channel komunikasi untuk calon petugas yang ingin mendaftar atau petugas/admin yang lupa password.

### 🔧 Cara Mengatur Nomor WhatsApp

#### 1. Untuk Petugas (Field Officer)
Edit file: `/src/app/pages/LoginPage.tsx`

```typescript
// Nomor WhatsApp Admin (format internasional tanpa +)
const ADMIN_WHATSAPP = '6281234567890'; // Ganti dengan nomor admin yang sebenarnya
```

**Ganti dengan nomor WhatsApp admin yang sebenarnya**

Format:
- Indonesia: `628XXXXXXXXXX` (ganti 08 dengan 628)
- Contoh: `6281234567890` untuk nomor 081234567890

#### 2. Untuk Admin  
Edit file: `/src/app/pages/AdminLoginPage.tsx`

```typescript
// Nomor WhatsApp Super Admin (format internasional tanpa +)
const SUPER_ADMIN_WHATSAPP = '6281234567890'; // Ganti dengan nomor super admin yang sebenarnya
```

**Ganti dengan nomor WhatsApp super admin/IT support**

#### 3. Untuk Recovery Page
Edit file: `/src/app/pages/RecoveryPage.tsx`

```typescript
// Nomor WhatsApp Admin (format internasional tanpa +)
const ADMIN_WHATSAPP = '6281234567890'; // Ganti dengan nomor admin yang sebenarnya
```

---

## 🎯 Fitur WhatsApp Integration

### 1. Login Petugas - Belum Punya Akun
**Lokasi**: Halaman Login Petugas (`/field-officer/login`)

**Button**: "Hubungi Admin via WhatsApp" (hijau dengan icon WhatsApp)

**Pesan otomatis yang dikirim**:
```
Halo Admin, saya ingin mendaftar sebagai petugas lapangan di aplikasi Field-to-Office Sync.
```

**Flow**:
1. Calon petugas klik button WhatsApp
2. Aplikasi WhatsApp terbuka otomatis
3. Chat sudah terisi dengan pesan template
4. Petugas tinggal kirim dan tunggu response dari admin

---

### 2. Login Admin - Lupa Password
**Lokasi**: Halaman Login Admin (`/admin/login`)

**Button**: "Lupa password?" (dengan icon WhatsApp)

**Pesan otomatis yang dikirim**:
```
Halo Super Admin, saya membutuhkan bantuan untuk mengakses akun admin saya di aplikasi Field-to-Office Sync.
```

**Flow**:
1. Admin yang lupa password klik link "Lupa password?"
2. Aplikasi WhatsApp terbuka otomatis ke Super Admin
3. Chat terisi dengan pesan template
4. Admin mengirim dan menunggu reset dari Super Admin

---

### 3. Recovery Page - Butuh Bantuan Lebih
**Lokasi**: Halaman Recovery (`/recovery`)

**Button**: "Hubungi Admin via WhatsApp"

**Pesan otomatis yang dikirim**:
```
Halo Admin, saya membutuhkan bantuan untuk mengakses akun saya di aplikasi Field-to-Office Sync.
```

**Flow**:
1. User klik button "Hubungi Admin via WhatsApp"
2. WhatsApp terbuka dengan pesan template
3. User bisa menjelaskan masalahnya lebih detail

---

## 🔐 Kebijakan Akses

### Aplikasi Ini BUKAN untuk Publik
✅ **Hanya untuk petugas terdaftar**
- Tidak ada fitur registrasi publik
- Tidak ada Google Sign In
- Tidak ada self-service password reset

### Proses Pendaftaran Petugas:
1. Calon petugas hubungi admin via WhatsApp
2. Admin verifikasi identitas calon petugas
3. Admin mendaftarkan akun secara manual (via backend atau database)
4. Admin memberikan username dan password ke petugas
5. Petugas login dengan kredensial yang diberikan

### Proses Reset Password:
1. Petugas/Admin hubungi Super Admin via WhatsApp
2. Super Admin verifikasi identitas
3. Super Admin reset password manual
4. Super Admin memberikan password baru via WhatsApp atau channel aman lainnya

---

## 📋 SOP Admin untuk Pendaftaran Petugas Baru

### Checklist Verifikasi:
- [ ] Identitas petugas (KTP/ID Card)
- [ ] SK Pengangkatan / Surat Tugas
- [ ] Nomor telepon yang aktif
- [ ] Email yang valid
- [ ] Area penugasan

### Data yang Dibutuhkan:
```
Nama Lengkap: _________________
NIK: _________________
Email: _________________
No. Telepon: _________________
Username: _________________ (buat unik)
Password Awal: _________________ (buat kuat)
```

### Langkah Pendaftaran Manual:
1. Terima request via WhatsApp dari calon petugas
2. Minta dokumen verifikasi (foto KTP, surat tugas)
3. Validasi dokumen
4. Buat akun baru di database/Google Sheets
5. Generate username dan password yang kuat
6. Kirim kredensial via WhatsApp dengan pesan:
```
Akun Anda telah dibuat!

Username: xxxxx
Password: xxxxx

Link aplikasi: [URL_APLIKASI]

PENTING:
1. Segera ganti password setelah login pertama
2. Jangan bagikan kredensial ke orang lain
3. Hubungi admin jika ada masalah
```

---

## 🛡️ Keamanan

### Best Practices:
1. **Gunakan Nomor WhatsApp Resmi**: Pastikan nomor admin adalah nomor resmi instansi
2. **Verifikasi Identitas**: Selalu verifikasi identitas sebelum membuat akun
3. **Password Policy**: 
   - Minimal 8 karakter
   - Kombinasi huruf besar, kecil, angka, simbol
   - Tidak menggunakan tanggal lahir atau data mudah ditebak
4. **Dokumentasi**: Catat semua pendaftaran di spreadsheet terpisah
5. **Review Berkala**: Review daftar akun aktif setiap bulan

### Monitoring:
- Track jumlah request pendaftaran per bulan
- Monitor akun yang tidak aktif > 3 bulan
- Deaktivasi akun petugas yang sudah resign/mutasi

---

## 🔄 Migrasi dari Self-Registration

Jika sebelumnya ada fitur self-registration, berikut langkah migrasi:

### Data Migration:
1. Export semua user yang sudah terdaftar
2. Review dan verifikasi identitas mereka
3. Kirim notifikasi perubahan sistem
4. Berikan periode grace untuk verifikasi ulang

### User Communication:
**Template WhatsApp Broadcast**:
```
[PENTING - Field-to-Office Sync]

Mulai [TANGGAL], sistem pendaftaran berubah menjadi:
- Tidak ada lagi self-registration
- Semua akun baru melalui admin
- Akun lama tetap aktif

Jika Anda lupa password:
1. Buka halaman login
2. Klik "Tidak dapat mengakses akun?"
3. Hubungi admin via WhatsApp

Terima kasih.
Admin Kemenkes
```

---

## 📞 Kontak

Untuk setup dan konfigurasi lebih lanjut, hubungi tim IT support.

**Nomor yang perlu dikonfigurasi**:
- Admin Petugas: [ISI NOMOR]
- Super Admin: [ISI NOMOR]
- IT Support: [ISI NOMOR]
