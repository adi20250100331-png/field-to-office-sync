# 📊 NIK Structure - Visual Guide

## 🔢 NIK Indonesia (16 Digit)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    3  1  7  4  0  1  2  5  0  8  9  0  0  0  0  1          │
│    └──┬──┘ └──┬──┘ └──┬──┘ └────┬────┘ └────┬────┘          │
│       │       │       │         │           │               │
│    PROVINSI  KOTA  KECAM.   TANGGAL      NOMOR             │
│                              LAHIR        URUT              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📍 PART 1: Kode Wilayah (6 digit)

### **Provinsi (2 digit)**

```
31 = DKI Jakarta
32 = Jawa Barat
33 = Jawa Tengah
35 = Jawa Timur
36 = Banten
51 = Bali
...
```

### **Kabupaten/Kota (2 digit)**

```
31│71 = Jakarta Pusat
31│72 = Jakarta Utara
31│73 = Jakarta Barat
31│74 = Jakarta Selatan
31│75 = Jakarta Timur
31│76 = Kepulauan Seribu
```

### **Kecamatan (2 digit)**

```
31│74│01 = Tebet
31│74│02 = Setiabudi
31│74│03 = Mampang Prapatan
31│74│04 = Pasar Minggu
...
```

**Contoh Lengkap:**
```
┌──────┬──────┬──────┐
│  31  │  74  │  01  │ = Jakarta Selatan, Tebet
└──────┴──────┴──────┘
```

---

## 📅 PART 2: Tanggal Lahir (6 digit)

### **Format: DD MM YY**

```
┌────────┬────────┬────────┐
│   DD   │   MM   │   YY   │
│ (Date) │(Month) │ (Year) │
└────────┴────────┴────────┘
```

### **🚹 LAKI-LAKI**

Tanggal lahir = Tanggal sebenarnya

**Contoh:**
```
Lahir: 25 Agustus 1990

┌────────┬────────┬────────┐
│   25   │   08   │   90   │
└────────┴────────┴────────┘

NIK: 3174012508900001
              ↑↑↑↑↑↑
              250890 = 25 Agustus 1990
```

### **🚺 PEREMPUAN**

Tanggal lahir = Tanggal sebenarnya **+ 40**

**Contoh:**
```
Lahir: 25 Agustus 1990

┌────────┬────────┬────────┐
│ 25+40  │   08   │   90   │
│   65   │   08   │   90   │
└────────┴────────┴────────┘

NIK: 3174016508900001
              ↑↑↑↑↑↑
              650890 = 25 Agustus 1990 (Perempuan)
```

### **📊 Comparison Table:**

| Tanggal Lahir | Laki-laki (DD) | Perempuan (DD+40) |
|---------------|----------------|-------------------|
| 1 | 01 | 41 |
| 5 | 05 | 45 |
| 10 | 10 | 50 |
| 15 | 15 | 55 |
| 20 | 20 | 60 |
| 25 | 25 | 65 |
| 31 | 31 | 71 |

### **📆 Month Codes:**

| Bulan | Kode |
|-------|------|
| Januari | 01 |
| Februari | 02 |
| Maret | 03 |
| April | 04 |
| Mei | 05 |
| Juni | 06 |
| Juli | 07 |
| Agustus | 08 |
| September | 09 |
| Oktober | 10 |
| November | 11 |
| Desember | 12 |

### **📅 Year Logic:**

```
YY = 00-24 → Born in 2000-2024
YY = 25-99 → Born in 1925-1999

Examples:
90 = 1990
00 = 2000
24 = 2024
25 = 1925
```

---

## 🔢 PART 3: Nomor Urut (4 digit)

```
┌──────────────┐
│ 0001 - 9999  │
└──────────────┘
```

Sequential number for people with:
- Same province
- Same city
- Same district
- Same birth date

**Examples:**
- First person: `0001`
- Second person: `0002`
- Hundredth person: `0100`
- Thousandth person: `1000`

---

## 🎯 COMPLETE EXAMPLES

### **Example 1: Laki-laki**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    3  1  7  4  0  1  2  5  0  8  9  0  0  0  0  1          │
│    └──┬──┘ └──┬──┘ └──┬──┘ └────┬────┘ └────┬────┘          │
│       │       │       │         │           │               │
│      31      74      01      250890      0001              │
│       │       │       │         │           │               │
│   DKI JAK  JKT SEL  Tebet   25/08/90   Urut #1            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Informasi:
✓ Provinsi: DKI Jakarta (31)
✓ Kota: Jakarta Selatan (74)
✓ Kecamatan: Tebet (01)
✓ Jenis Kelamin: Laki-laki (DD = 25)
✓ Tanggal Lahir: 25 Agustus 1990
✓ Nomor Urut: 0001
```

### **Example 2: Perempuan**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    3  1  7  4  0  1  6  5  0  8  9  0  0  0  0  2          │
│    └──┬──┘ └──┬──┘ └──┬──┘ └────┬────┘ └────┬────┘          │
│       │       │       │         │           │               │
│      31      74      01      650890      0002              │
│       │       │       │         │           │               │
│   DKI JAK  JKT SEL  Tebet   25/08/90   Urut #2            │
│                              (65-40=25)                     │
└─────────────────────────────────────────────────────────────┘

Informasi:
✓ Provinsi: DKI Jakarta (31)
✓ Kota: Jakarta Selatan (74)
✓ Kecamatan: Tebet (01)
✓ Jenis Kelamin: Perempuan (DD = 65 → 65-40 = 25)
✓ Tanggal Lahir: 25 Agustus 1990
✓ Nomor Urut: 0002
```

### **Example 3: Perempuan Lahir 8 Februari 2000**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    3  3  7  4  0  1  4  8  0  2  0  0  1  2  3  4          │
│    └──┬──┘ └──┬──┘ └──┬──┘ └────┬────┘ └────┬────┘          │
│       │       │       │         │           │               │
│      33      74      01      480200      1234              │
│       │       │       │         │           │               │
│   Jawa     Kota X  Kecam.   08/02/00   Urut #1234         │
│   Tengah                     (48-40=8)                      │
└─────────────────────────────────────────────────────────────┘

Informasi:
✓ Provinsi: Jawa Tengah (33)
✓ Kota: [Kode 74]
✓ Kecamatan: [Kode 01]
✓ Jenis Kelamin: Perempuan (DD = 48 → 48-40 = 8)
✓ Tanggal Lahir: 8 Februari 2000
✓ Nomor Urut: 1234
```

---

## 🔍 VALIDATION LOGIC FLOWCHART

```
┌─────────────────┐
│  Input NIK      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Remove spaces,  │
│ dots, dashes    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Length = 16?    ├─────────►│ ERROR: Wrong    │
└────────┬────────┘           │ length          │
         │ YES                └─────────────────┘
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ All digits?     ├─────────►│ ERROR: Non-     │
└────────┬────────┘           │ numeric chars   │
         │ YES                └─────────────────┘
         ▼
┌─────────────────┐
│ Extract:        │
│ - Province (1-2)│
│ - City (3-4)    │
│ - District (5-6)│
│ - Date (7-8)    │
│ - Month (9-10)  │
│ - Year (11-12)  │
│ - Seq (13-16)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Date > 40?      ├─────────►│ Gender: Male    │
└────────┬────────┘           │ Date = Date     │
         │ YES                └─────────────────┘
         ▼
┌─────────────────┐
│ Gender: Female  │
│ Date = Date-40  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Date 1-31?      ├─────────►│ ERROR: Invalid  │
└────────┬────────┘           │ date            │
         │ YES                └─────────────────┘
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Month 1-12?     ├─────────►│ ERROR: Invalid  │
└────────┬────────┘           │ month           │
         │ YES                └─────────────────┘
         ▼
┌─────────────────┐
│ Calculate full  │
│ year from YY    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Valid calendar  ├─────────►│ ERROR: Invalid  │
│ date?           │           │ calendar date   │
└────────┬────────┘           └─────────────────┘
         │ YES
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Not future?     ├─────────►│ ERROR: Future   │
└────────┬────────┘           │ date            │
         │ YES                └─────────────────┘
         ▼
┌─────────────────┐    NO    ┌─────────────────┐
│ Age < 150?      ├─────────►│ ERROR: Too old  │
└────────┬────────┘           └─────────────────┘
         │ YES
         ▼
┌─────────────────┐
│ ✅ VALID NIK    │
│                 │
│ Return:         │
│ - Gender        │
│ - Birth Date    │
│ - Province      │
│ - City          │
│ - District      │
└─────────────────┘
```

---

## 📋 QUICK REFERENCE TABLE

### **Gender Detection:**

| DD Value | Gender | Actual Date |
|----------|--------|-------------|
| 01-31 | Laki-laki | Same as DD |
| 41-71 | Perempuan | DD - 40 |

**Examples:**
- DD = 15 → Male, born on 15th
- DD = 55 → Female, born on 15th (55-40=15)

### **Year Conversion:**

| YY | Full Year | Logic |
|----|-----------|-------|
| 00 | 2000 | YY ≤ current year + 10 → 2000s |
| 10 | 2010 | YY ≤ current year + 10 → 2000s |
| 24 | 2024 | YY ≤ current year + 10 → 2000s |
| 35 | 1935 | YY > current year + 10 → 1900s |
| 90 | 1990 | YY > current year + 10 → 1900s |
| 99 | 1999 | YY > current year + 10 → 1900s |

*Note: Current year = 2026*

---

## 🎓 PRACTICE EXERCISES

### **Exercise 1: Decode this NIK**
```
3275014512850003
```

<details>
<summary>Click to see answer</summary>

```
32 75 01 45 12 85 0003

Province: 32 (Jawa Barat)
City: 75
District: 01
Gender: Perempuan (45 > 40)
Birth Date: 5 Desember 1985 (45-40=5, month=12, year=85→1985)
Sequence: 0003
```
</details>

### **Exercise 2: Decode this NIK**
```
3174012508900001
```

<details>
<summary>Click to see answer</summary>

```
31 74 01 25 08 90 0001

Province: 31 (DKI Jakarta)
City: 74 (Jakarta Selatan)
District: 01 (Tebet)
Gender: Laki-laki (25 ≤ 31)
Birth Date: 25 Agustus 1990
Sequence: 0001
```
</details>

### **Exercise 3: Is this NIK valid?**
```
3174013508900001
```

<details>
<summary>Click to see answer</summary>

```
❌ INVALID

Reason: Date = 35 (no month has 35 days)
Maximum date in any month = 31
```
</details>

### **Exercise 4: Is this NIK valid?**
```
3174013002900001
```

<details>
<summary>Click to see answer</summary>

```
❌ INVALID

Reason: 30 Februari doesn't exist
February has maximum 29 days (leap year) or 28 days
```
</details>

---

## 💡 TIPS & TRICKS

### **Tip 1: Quick Gender Check**
```
If 7th-8th digit > 40:
  → Perempuan
Else:
  → Laki-laki
```

### **Tip 2: Quick Age Estimation**
```
Current year = 2026
YY = 90
Age ≈ 2026 - 1990 = 36 years old
```

### **Tip 3: Validate Month-Day Combo**
```
Invalid combinations:
- Month 02, Day > 29
- Month 04/06/09/11, Day > 30
- Any month, Day > 31
```

### **Tip 4: Future Date Check**
```
If full year > current year:
  → INVALID (future date)
```

---

## 🔗 RELATED DOCUMENTATION

- See `/FITUR_VALIDASI_NIK.md` for implementation details
- See `/NIK_VALIDATION_QUICK_START.md` for code examples
- See `/src/app/utils/nikValidator.ts` for source code

---

**📚 Visual Guide Complete!**

This guide helps you understand the structure of Indonesian NIK (Nomor Induk Kependudukan) for better validation and data extraction.
