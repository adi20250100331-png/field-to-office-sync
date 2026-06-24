# Panduan Tema dan Autentikasi

## 🎨 Mode Light/Dark Theme

Aplikasi sekarang mendukung mode terang dan gelap yang dapat beralih secara dinamis.

### Fitur Theme:
- **Toggle Theme Button**: Tersedia di semua halaman (icon matahari/bulan)
- **Auto-detect**: Otomatis mengikuti preferensi sistem saat pertama kali dibuka
- **Persistent**: Pilihan theme tersimpan di localStorage
- **Dark Mode Colors**: Palet warna yang dioptimasi untuk mode gelap

### Lokasi Theme Toggle:
- ✅ Halaman Beranda (HomePage)
- ✅ Login Petugas (LoginPage)
- ✅ Login Admin (AdminLoginPage)
- ✅ Halaman Registrasi (RegisterPage)
- ✅ Halaman Pemulihan (RecoveryPage)
- ✅ Dashboard Petugas (FieldOfficerDashboard)
- ✅ Dashboard Admin (AdminDashboard)

### Cara Menggunakan:
1. Klik icon bulan/matahari di pojok kanan atas
2. Theme akan beralih dan tersimpan otomatis
3. Pilihan akan tetap sama saat aplikasi dibuka kembali

---

## 🔐 Sistem Autentikasi Lengkap

### 1. Login Petugas Lapangan
**Route**: `/field-officer/login`

**Akun Demo Petugas:**
```
Username: adhy     | Password: adhy123
Username: budi     | Password: budi123
Username: siti     | Password: siti123
```

**Fitur:**
- Login dengan username/password
- Login dengan Google (demo mode)
- Link ke halaman registrasi
- Link ke halaman pemulihan akun
- Tombol logout di dashboard

### 2. Login Admin
**Route**: `/admin/login`

**Akun Demo Admin:**
```
Username: admin      | Password: admin123
Username: supervisor | Password: super123
```

**Fitur:**
- Login khusus untuk admin
- Autentikasi terpisah dari petugas
- Tombol logout di dashboard admin

### 3. ~~Registrasi Akun Baru~~ ❌ DIHAPUS
**Alasan**: Aplikasi ini hanya untuk petugas terdaftar, bukan untuk publik

**Diganti dengan**: WhatsApp Integration untuk kontak admin

### 4. Pemulihan Akun
**Route**: `/recovery`

**Fitur:**
- Reset password via email
- Simulasi pengiriman email reset
- Informasi kontak helpdesk
- Link kembali ke login

### 5. Google Sign In
**Tersedia di**: Login Petugas

**Fitur:**
- Tombol "Masuk dengan Google"
- Simulasi OAuth flow
- Auto-create akun demo untuk testing

---

## 🚪 Tombol Logout

### Petugas Lapangan
**Lokasi**: Dashboard Petugas (header kanan atas)
- Icon: LogOut
- Text: "Keluar" (hidden di mobile)
- Redirect: `/field-officer/login`

### Admin
**Lokasi**: Dashboard Admin (header kanan atas)
- Icon: LogOut  
- Text: "Keluar" (hidden di mobile)
- Redirect: `/admin/login`

---

## 📱 Navigasi & Flow

### Flow Petugas:
```
Beranda → Login Petugas → Dashboard Petugas
                ↓
            Registrasi
                ↓
        Pemulihan Akun
```

### Flow Admin:
```
Beranda → Login Admin → Dashboard Admin
```

### Protected Routes:
- `/field-officer` - Butuh login sebagai petugas
- `/field-officer/collect-data` - Butuh login sebagai petugas
- `/admin` - Butuh login sebagai admin

---

## 🎯 Link Penting

### Dari Beranda:
- "Masuk sebagai Petugas" → `/field-officer/login`
- "Masuk sebagai Admin" → `/admin/login`

### Dari Login Petugas:
- "Tidak dapat mengakses akun Anda?" → `/recovery`
- "Belum punya akun? Daftar sekarang" → `/register`
- "Masuk dengan Google" → Google OAuth (demo)

### Dari Login Admin:
- "Lupa password?" → `/recovery`

### Dari Registrasi:
- "Sudah punya akun? Masuk di sini" → `/field-officer/login`

---

## 💻 Implementasi Teknis

### Context Providers:
1. **ThemeProvider** (`/src/app/context/ThemeContext.tsx`)
   - Mengelola state theme (light/dark)
   - Persistent dengan localStorage
   - Auto-detect system preference

2. **AuthProvider** (`/src/app/context/AuthContext.tsx`)
   - Mengelola login petugas & admin
   - Login dengan Google
   - Registrasi user baru
   - Session persistence
   - Protected routes

### Komponen:
- **ThemeToggle** (`/src/app/components/ThemeToggle.tsx`)
  - Button untuk toggle theme
  - Icon dinamis (Sun/Moon)

### Halaman:
- `LoginPage.tsx` - Login petugas dengan Google sign in
- `AdminLoginPage.tsx` - Login khusus admin
- `RegisterPage.tsx` - Form registrasi
- `RecoveryPage.tsx` - Pemulihan akun

### Dark Mode CSS:
Semua token warna sudah dikonfigurasi di `/src/styles/theme.css`:
- Light mode: Warna cerah Kemenkes (teal & lime)
- Dark mode: Warna gelap dengan accent yang lebih lembut

---

## 🔄 Update Routes

Routes baru yang ditambahkan:
```typescript
{
  path: "/admin/login",
  Component: AdminLoginPage,
},
{
  path: "/register",
  Component: RegisterPage,
},
{
  path: "/recovery",
  Component: RecoveryPage,
}
```

---

## ✨ Best Practices

1. **Theme**: Gunakan Tailwind classes dengan prefix `dark:` untuk styling mode gelap
2. **Auth**: Selalu cek `isAuthenticated` sebelum akses protected routes
3. **Logout**: Selalu clear session dan redirect ke login
4. **Registration**: Validasi di frontend sebelum submit
5. **Google OAuth**: Untuk production, integrasikan dengan Firebase/Google OAuth

---

## 🚀 Development Mode

Untuk testing cepat:
- Gunakan akun demo yang sudah disediakan
- Google Sign In otomatis create user demo
- Registrasi langsung login tanpa verifikasi email

Untuk production:
- Integrasikan dengan Google Apps Script backend
- Tambahkan email verification untuk registrasi
- Implementasi real Google OAuth
- Tambahkan rate limiting dan captcha
