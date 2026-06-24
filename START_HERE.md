# 🚀 START HERE - Quick Start Guide

Selamat datang di **Field-to-Office Sync**!

---

## ⚡ Mulai Cepat (1 Menit)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Buka Browser

```
http://localhost:3000
```

**Done! Aplikasi sudah berjalan! ✅**

---

## 🎯 Login

### Field Officer Login

```
Username: adhy
Password: adhy123
```

**Atau:**
```
Username: budi  | siti
Password: budi123 | siti123
```

### Admin Login

*(Akan tersedia setelah setup Google Sheets)*

---

## 📱 Mode Saat Ini: Development

Aplikasi berjalan dalam **Development Mode**:
- ✅ Tidak perlu konfigurasi tambahan
- ✅ Data tersimpan di browser (localStorage)
- ✅ Cocok untuk testing & development
- ⚠️ Data tidak tersinkronisasi ke cloud

**Lihat banner biru di aplikasi untuk info lebih lanjut.**

---

## 🚀 Upgrade ke Production (Opsional)

Ingin data tersimpan di cloud? Setup hanya **5 menit**!

**Ikuti panduan:**
- 🇮🇩 Bahasa Indonesia: [PANDUAN_CEPAT_GOOGLE_SHEETS.md](./PANDUAN_CEPAT_GOOGLE_SHEETS.md)
- 🇬🇧 English: [QUICK_SETUP_GOOGLE_SHEETS.md](./QUICK_SETUP_GOOGLE_SHEETS.md)

**Setelah setup:**
- ✅ Data di Google Sheets (cloud)
- ✅ Dokumen di Google Drive
- ✅ Multi-device access
- ✅ Real-time sync
- ✅ 100% GRATIS

---

## 📚 Dokumentasi

### Quick Links

- **Setup Google Sheets:** [PANDUAN_CEPAT_GOOGLE_SHEETS.md](./PANDUAN_CEPAT_GOOGLE_SHEETS.md)
- **Mode Development:** [MODE_DEVELOPMENT.md](./MODE_DEVELOPMENT.md)
- **All Documentation:** [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
- **API Reference:** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

### Untuk Developer

- **Architecture:** [GOOGLE_SHEETS_INTEGRATION.md](./GOOGLE_SHEETS_INTEGRATION.md)
- **Testing:** [TEST_API.md](./TEST_API.md)
- **Implementation:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🎮 Try It Out

### 1. Login sebagai Field Officer

```
http://localhost:3000/field-officer/login
Username: adhy
Password: adhy123
```

### 2. Buat Pengajuan Baru

1. Click **"Buat Pengajuan Baru"**
2. Isi formulir pemeriksaan jenazah
3. Upload dokumen (optional)
4. Submit

### 3. Lihat Dashboard

- Total pengajuan
- Status (pending/verified/rejected)
- Notifikasi
- Detail pengajuan

---

## 💡 Tips

### Development Mode Banner

Anda akan lihat banner biru di bagian atas:
```
ℹ️ Mode Development - Data Lokal
```

**Ini normal!** Artinya:
- ✅ App berjalan dalam development mode
- ✅ Data di localStorage (tidak hilang saat refresh)
- ✅ Bisa di-dismiss jika mengganggu

**Untuk production**, setup Google Sheets (5 menit).

### Browser Console

Buka console (F12) untuk lihat:
```
🔧 Development Mode
ℹ️ Aplikasi berjalan dalam Local Mode (data di localStorage)
📚 Untuk mengaktifkan Google Sheets sync, lihat: PANDUAN_CEPAT_GOOGLE_SHEETS.md
```

Ini **bukan error**, hanya informasi mode.

---

## 🔍 Troubleshooting

### Port sudah digunakan?

```bash
# Ganti port
npm run dev -- --port 3001
```

### Dependencies error?

```bash
# Clear cache & reinstall
rm -rf node_modules package-lock.json
npm install
```

### Data tidak tersimpan?

**Cek:**
- Browser tidak dalam incognito mode
- localStorage tidak disabled
- Tidak clear cache saat development

**Solusi:** Setup Production Mode untuk data persisten di cloud.

---

## 📞 Need Help?

### Check Documentation

1. **[MODE_DEVELOPMENT.md](./MODE_DEVELOPMENT.md)** - Penjelasan mode
2. **[DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)** - Index semua docs
3. **Browser Console** - Lihat error messages

### Common Questions

**Q: Data hilang saat clear cache?**
A: Ya, Development Mode pakai localStorage. Setup Production Mode untuk data di cloud.

**Q: Bisa pakai untuk production?**
A: Bisa, tapi setup Google Sheets dulu (5 menit) untuk fitur lengkap.

**Q: Berapa biaya?**
A: 100% GRATIS! Tidak ada biaya sama sekali.

---

## ✅ Checklist

**Getting Started:**
- [ ] npm install
- [ ] npm run dev
- [ ] Buka http://localhost:3000
- [ ] Login dengan adhy/adhy123
- [ ] Buat pengajuan test
- [ ] Lihat dashboard

**Next Steps (Optional):**
- [ ] Baca MODE_DEVELOPMENT.md
- [ ] Setup Google Sheets (PANDUAN_CEPAT_GOOGLE_SHEETS.md)
- [ ] Test production mode
- [ ] Deploy aplikasi

---

## 🎯 What's Next?

### Option 1: Continue in Development Mode
- ✅ Langsung bisa digunakan
- ✅ Perfect untuk testing
- ✅ No setup required

### Option 2: Upgrade to Production
- 📚 Read: [PANDUAN_CEPAT_GOOGLE_SHEETS.md](./PANDUAN_CEPAT_GOOGLE_SHEETS.md)
- ⏱️ Time: 5 minutes
- 💰 Cost: FREE
- ✨ Benefits: Cloud storage, multi-device, real-time sync

---

## 🎊 You're All Set!

Aplikasi sudah berjalan dan siap digunakan!

**Development Mode:**
- ✅ Working perfectly
- ✅ All features available
- ✅ Data in localStorage
- 📱 Ready for testing

**Want Production Mode?**
- Follow [PANDUAN_CEPAT_GOOGLE_SHEETS.md](./PANDUAN_CEPAT_GOOGLE_SHEETS.md)
- Takes only 5 minutes
- 100% FREE

---

## 📊 Project Structure

```
field-to-office-sync/
├── src/
│   ├── app/
│   │   ├── components/     # UI components
│   │   ├── context/        # React Context (State)
│   │   ├── pages/          # Page components
│   │   └── routes.tsx      # Route configuration
│   └── lib/
│       ├── api.ts          # Google Sheets API client
│       └── google-sheets.service.ts  # Helper functions
├── .env                    # Environment config (created)
├── .env.example            # Environment template
└── [Documentation files]   # Setup & usage guides
```

---

## 🏆 Features

- ✅ **Field Officer Dashboard** - Submit data lapangan
- ✅ **Admin Dashboard** - Verifikasi & monitoring
- ✅ **OCR Integration** - Scan dokumen otomatis
- ✅ **Real-time Notifications** - Update status
- ✅ **Google Sheets Sync** - Cloud storage (optional)
- ✅ **Google Drive Upload** - Dokumen storage (optional)
- ✅ **Responsive Design** - Mobile & desktop friendly
- ✅ **Offline Capable** - Works without internet

---

**Happy Coding! 🚀**

Questions? Check [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)
