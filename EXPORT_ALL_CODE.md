# Export All Source Code - Aplikasi Pemeriksaan Jenazah

Tanggal Export: 5 Mei 2026

## Struktur Proyek

```
src/
├── app/
│   ├── App.tsx
│   ├── routes.tsx
│   ├── components/
│   │   ├── DevelopmentModeBanner.tsx
│   │   ├── Footer.tsx
│   │   ├── GoogleSheetsStatus.tsx
│   │   ├── InfectiousDiseaseAlert.tsx
│   │   ├── NIKInput.tsx
│   │   ├── NIKInputDemo.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── figma/
│   │   │   └── ImageWithFallback.tsx
│   │   └── ui/ (60+ komponen shadcn/ui)
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── DataContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLoginPage.tsx
│   │   ├── DataCollectionForm.tsx
│   │   ├── FieldOfficerDashboard.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── RecoveryPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── TechArchitecture.tsx
│   └── utils/
│       └── nikValidator.ts
├── lib/
│   ├── api.ts
│   └── google-sheets.service.ts
└── styles/
    ├── fonts.css
    ├── globals.css
    ├── index.css
    ├── tailwind.css
    └── theme.css
```

## File Konfigurasi Root

### package.json
