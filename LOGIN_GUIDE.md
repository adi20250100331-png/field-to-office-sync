# Panduan Login Field Officer

## Fitur Login

Sistem Field-to-Office Sync sekarang dilengkapi dengan sistem autentikasi untuk Petugas Lapangan (Field Officer).

## Alur Kerja Login

1. **Akses Halaman Login**
   - Dari homepage, klik tombol "Masuk sebagai Petugas"
   - Atau akses langsung: `/field-officer/login`

2. **Masukkan Kredensial**
   - Username
   - Password

3. **Setelah Login Berhasil**
   - Otomatis diarahkan ke Dashboard Petugas Lapangan
   - Session tersimpan di browser (localStorage)
   - Tidak perlu login ulang saat refresh halaman

4. **Logout**
   - Klik tombol "Keluar" di header dashboard
   - Session akan dihapus dan kembali ke halaman login

## Protected Routes

Halaman-halaman berikut memerlukan login:
- `/field-officer` - Dashboard Petugas Lapangan
- `/field-officer/collect-data` - Form Pengumpulan Data

Jika mencoba mengakses tanpa login, akan otomatis diarahkan ke halaman login.

## Akun Demo untuk Testing

### Akun 1 - Adhy
- Username: `adhy`
- Password: `adhy123`

### Akun 2 - Budi Hartono
- Username: `budi`
- Password: `budi123`

### Akun 3 - Siti Nurhaliza
- Username: `siti`
- Password: `siti123`

## Struktur Kode

### 1. AuthContext (`/src/app/context/AuthContext.tsx`)
Context untuk mengelola state autentikasi:
- `user`: Data user yang sedang login
- `isAuthenticated`: Status login (true/false)
- `login()`: Function untuk login
- `logout()`: Function untuk logout
- `isLoading`: Loading state saat check autentikasi

### 2. LoginPage (`/src/app/pages/LoginPage.tsx`)
Halaman login dengan fitur:
- Form username & password
- Toggle show/hide password
- Error message handling
- Loading state saat proses login
- Info akun demo

### 3. ProtectedRoute (`/src/app/components/ProtectedRoute.tsx`)
Wrapper component untuk melindungi routes:
- Check status autentikasi
- Redirect ke login jika belum login
- Simpan URL tujuan untuk redirect setelah login

## Session Management

- **Penyimpanan**: localStorage dengan key `field_officer_auth`
- **Persistensi**: Session bertahan meskipun browser di-refresh
- **Clear Session**: Session dihapus saat logout atau user manual clear localStorage

## Menambah User Baru

Edit file `/src/app/context/AuthContext.tsx`:

```typescript
const FIELD_OFFICERS: FieldOfficerCredentials[] = [
  // ... existing users
  {
    id: 'officer-004',
    name: 'Nama Baru',
    email: 'email@fieldoffice.com',
    username: 'username_baru',
    password: 'password123',
  },
];
```

## Keamanan

⚠️ **PENTING untuk Production**:
- Password saat ini disimpan dalam plain text (hanya untuk demo)
- Untuk production, gunakan:
  - Backend API untuk autentikasi
  - Password hashing (bcrypt, argon2)
  - JWT atau session tokens
  - HTTPS
  - Rate limiting untuk prevent brute force

## Integrasi dengan Backend (Opsional)

Untuk mengganti autentikasi lokal dengan API:

```typescript
// Di AuthContext.tsx
const login = async (username: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));
      return { success: true };
    } else {
      return { success: false, error: 'Login gagal' };
    }
  } catch (error) {
    return { success: false, error: 'Koneksi error' };
  }
};
```

## Troubleshooting

### Tidak bisa login
- Pastikan username dan password benar (case-sensitive)
- Check console browser untuk error
- Clear localStorage dan coba lagi

### Redirect loop
- Clear browser cache dan localStorage
- Check di AuthContext apakah data tersimpan dengan benar

### Session hilang setelah refresh
- Check apakah localStorage berfungsi (tidak di-disable)
- Check apakah ada error di console saat parse JSON

## Next Steps

Fitur yang bisa ditambahkan:
- [ ] Remember me checkbox
- [ ] Forgot password functionality
- [ ] User registration
- [ ] Role-based access control
- [ ] Login history/audit log
- [ ] Multi-factor authentication (MFA)
- [ ] Password strength requirements
- [ ] Account lockout after failed attempts
