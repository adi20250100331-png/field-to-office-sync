# 📋 Cara Copy Seluruh Code ke VS Code

## 🎯 Ada 3 Opsi yang Bisa Dipilih

### **Opsi 1: Download File Text Lengkap (PALING MUDAH)**

Saya sudah membuat file `ALL_SOURCE_CODE.txt` (560KB) yang berisi SEMUA source code dengan format yang rapi.

**Cara Menggunakan:**
1. Buka file `ALL_SOURCE_CODE.txt` 
2. Copy seluruh isinya (Ctrl+A, Ctrl+C)
3. Paste ke text editor atau buat struktur folder di VS Code secara manual

File ini berisi semua code dengan header yang jelas seperti:
```
================================================
FILE: src/app/App.tsx
================================================
[isi code]
================================================
FILE: src/app/components/Footer.tsx
================================================
[isi code]
```

---

### **Opsi 2: Download Archive Compressed**

File `source-code-export.tar.gz` (284KB) berisi struktur folder lengkap yang bisa langsung di-extract.

**Cara Menggunakan:**
1. Download file `source-code-export.tar.gz`
2. Extract dengan perintah: `tar -xzf source-code-export.tar.gz`
3. Buka folder hasil extract di VS Code

**Isi Archive:**
- ✅ Semua file di folder `src/`
- ✅ `package.json` dan `pnpm-lock.yaml`
- ✅ Config files (vite.config.ts, postcss.config.mjs, dll)
- ✅ Semua file dokumentasi (.md)
- ✅ Backend scripts (.js, .sql)

---

### **Opsi 3: Clone Manual File per File**

Jika Anda ingin lebih kontrol, berikut daftar semua file penting:

## 📁 Struktur Folder & File (81 Total)

### Root Files (Konfigurasi)
```
package.json
pnpm-lock.yaml
vite.config.ts
postcss.config.mjs
.npmrc
```

### Styles (5 files)
```
src/styles/fonts.css
src/styles/globals.css
src/styles/index.css
src/styles/tailwind.css
src/styles/theme.css
```

### Main App (2 files)
```
src/app/App.tsx
src/app/routes.tsx
```

### Context (3 files)
```
src/app/context/AuthContext.tsx
src/app/context/DataContext.tsx
src/app/context/ThemeContext.tsx
```

### Utils (1 file)
```
src/app/utils/nikValidator.ts
```

### Library (2 files)
```
src/lib/api.ts
src/lib/google-sheets.service.ts
```

### Custom Components (9 files)
```
src/app/components/DevelopmentModeBanner.tsx
src/app/components/Footer.tsx
src/app/components/GoogleSheetsStatus.tsx
src/app/components/InfectiousDiseaseAlert.tsx
src/app/components/NIKInput.tsx
src/app/components/NIKInputDemo.tsx
src/app/components/ProtectedRoute.tsx
src/app/components/ThemeToggle.tsx
src/app/components/figma/ImageWithFallback.tsx
```

### Pages (9 files)
```
src/app/pages/AdminDashboard.tsx
src/app/pages/AdminLoginPage.tsx
src/app/pages/DataCollectionForm.tsx
src/app/pages/FieldOfficerDashboard.tsx
src/app/pages/HomePage.tsx
src/app/pages/LoginPage.tsx
src/app/pages/RecoveryPage.tsx
src/app/pages/RegisterPage.tsx
src/app/pages/TechArchitecture.tsx
```

### UI Components - shadcn/ui (60+ files)
```
src/app/components/ui/accordion.tsx
src/app/components/ui/alert-dialog.tsx
src/app/components/ui/alert.tsx
src/app/components/ui/aspect-ratio.tsx
src/app/components/ui/avatar.tsx
src/app/components/ui/badge.tsx
src/app/components/ui/breadcrumb.tsx
src/app/components/ui/button.tsx
src/app/components/ui/calendar.tsx
src/app/components/ui/card.tsx
src/app/components/ui/carousel.tsx
src/app/components/ui/chart.tsx
src/app/components/ui/checkbox.tsx
src/app/components/ui/collapsible.tsx
src/app/components/ui/command.tsx
src/app/components/ui/context-menu.tsx
src/app/components/ui/dialog.tsx
src/app/components/ui/drawer.tsx
src/app/components/ui/dropdown-menu.tsx
src/app/components/ui/form.tsx
src/app/components/ui/hover-card.tsx
src/app/components/ui/input-otp.tsx
src/app/components/ui/input.tsx
src/app/components/ui/label.tsx
src/app/components/ui/menubar.tsx
src/app/components/ui/navigation-menu.tsx
src/app/components/ui/pagination.tsx
src/app/components/ui/popover.tsx
src/app/components/ui/progress.tsx
src/app/components/ui/radio-group.tsx
src/app/components/ui/resizable.tsx
src/app/components/ui/scroll-area.tsx
src/app/components/ui/select.tsx
src/app/components/ui/separator.tsx
src/app/components/ui/sheet.tsx
src/app/components/ui/sidebar.tsx
src/app/components/ui/skeleton.tsx
src/app/components/ui/slider.tsx
src/app/components/ui/sonner.tsx
src/app/components/ui/switch.tsx
src/app/components/ui/table.tsx
src/app/components/ui/tabs.tsx
src/app/components/ui/textarea.tsx
src/app/components/ui/toggle-group.tsx
src/app/components/ui/toggle.tsx
src/app/components/ui/tooltip.tsx
src/app/components/ui/use-mobile.ts
src/app/components/ui/utils.ts
```

### Backend Scripts
```
google-apps-script-backend.js
supabase-setup.sql
```

---

## 🚀 Quick Start di VS Code Lokal

Setelah copy semua file:

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env dan isi variabel yang diperlukan

# 3. Run development server
pnpm dev
```

---

## 📌 Catatan Penting

1. **Dependencies**: Semua package ada di `package.json`, gunakan `pnpm` bukan `npm`

2. **Environment Variables**: 
   - Copy dari `.env.example` ke `.env`
   - Isi API keys dan konfigurasi sesuai kebutuhan

3. **Backend Setup**:
   - Google Sheets: Lihat `GOOGLE_SHEETS_API_SETUP.md`
   - Supabase: Lihat `SUPABASE_INTEGRATION.md`

4. **Dokumentasi Lengkap**: 
   - `DOCUMENTATION_INDEX.md` - Index semua dokumentasi
   - `START_HERE.md` - Panduan awal
   - `QUICK_START.md` - Quick start guide

---

## ✅ File yang Sudah Dibuat

- ✅ `source-code-export.tar.gz` - Archive compressed (284KB)
- ✅ `ALL_SOURCE_CODE.txt` - Text file lengkap (560KB)
- ✅ `CARA_COPY_KE_VSCODE.md` - Panduan ini

---

## 🆘 Butuh Bantuan?

Jika ada pertanyaan atau kendala saat setup di VS Code lokal, silakan tanyakan!
