/**
 * NIK (Nomor Induk Kependudukan) Validator
 * 
 * NIK Indonesia terdiri dari 16 digit dengan struktur:
 * - 6 digit: Kode wilayah (provinsi, kabupaten/kota, kecamatan)
 * - 6 digit: Tanggal lahir (DDMMYY) - untuk perempuan DD + 40
 * - 4 digit: Nomor urut
 * 
 * Contoh: 3174012508900001
 * - 31: Provinsi DKI Jakarta
 * - 74: Kota Jakarta Selatan
 * - 01: Kecamatan Tebet
 * - 25: Tanggal lahir
 * - 08: Bulan lahir (Agustus)
 * - 90: Tahun lahir (1990)
 * - 0001: Nomor urut
 */

export interface NIKValidationResult {
  isValid: boolean;
  error?: string;
  details?: {
    provinsi: string;
    kabupatenKota: string;
    kecamatan: string;
    tanggalLahir: string;
    jenisKelamin: 'Laki-laki' | 'Perempuan';
    tahunLahir: number;
  };
}

/**
 * Validasi format NIK (16 digit angka)
 */
export function validateNIKFormat(nik: string): NIKValidationResult {
  // Trim whitespace
  const cleanNIK = nik.trim();

  // Check if empty
  if (!cleanNIK) {
    return {
      isValid: false,
      error: 'NIK tidak boleh kosong'
    };
  }

  // Check if contains only numbers
  if (!/^\d+$/.test(cleanNIK)) {
    return {
      isValid: false,
      error: 'NIK hanya boleh berisi angka'
    };
  }

  // Check length (must be exactly 16 digits)
  if (cleanNIK.length !== 16) {
    return {
      isValid: false,
      error: `NIK harus 16 digit (saat ini: ${cleanNIK.length} digit)`
    };
  }

  // Extract components
  const provinsi = cleanNIK.substring(0, 2);
  const kabupatenKota = cleanNIK.substring(2, 4);
  const kecamatan = cleanNIK.substring(4, 6);
  let tanggal = parseInt(cleanNIK.substring(6, 8));
  const bulan = parseInt(cleanNIK.substring(8, 10));
  const tahun = parseInt(cleanNIK.substring(10, 12));
  const nomorUrut = cleanNIK.substring(12, 16);

  // Determine gender (if tanggal > 40, it's female)
  const jenisKelamin: 'Laki-laki' | 'Perempuan' = tanggal > 40 ? 'Perempuan' : 'Laki-laki';
  if (tanggal > 40) {
    tanggal -= 40; // Normalize date for females
  }

  // Validate date components
  if (tanggal < 1 || tanggal > 31) {
    return {
      isValid: false,
      error: `Tanggal lahir tidak valid (${tanggal})`
    };
  }

  if (bulan < 1 || bulan > 12) {
    return {
      isValid: false,
      error: `Bulan lahir tidak valid (${bulan})`
    };
  }

  // Validate year (assume people are born between 1900-2099)
  const currentYear = new Date().getFullYear() % 100;
  let fullYear: number;
  
  if (tahun <= currentYear + 10) {
    fullYear = 2000 + tahun; // 00-34 -> 2000-2034
  } else {
    fullYear = 1900 + tahun; // 35-99 -> 1935-1999
  }

  // Check if date is valid
  const testDate = new Date(fullYear, bulan - 1, tanggal);
  if (
    testDate.getFullYear() !== fullYear ||
    testDate.getMonth() !== bulan - 1 ||
    testDate.getDate() !== tanggal
  ) {
    return {
      isValid: false,
      error: `Tanggal ${String(tanggal).padStart(2, '0')}/${String(bulan).padStart(2, '0')}/${fullYear} tidak valid`
    };
  }

  // Check if person is not from the future
  if (testDate > new Date()) {
    return {
      isValid: false,
      error: 'Tanggal lahir tidak boleh di masa depan'
    };
  }

  // Check if person is not too old (e.g., > 150 years)
  const age = new Date().getFullYear() - fullYear;
  if (age > 150) {
    return {
      isValid: false,
      error: `Usia tidak wajar (${age} tahun)`
    };
  }

  // All validations passed
  return {
    isValid: true,
    details: {
      provinsi,
      kabupatenKota,
      kecamatan,
      tanggalLahir: `${String(tanggal).padStart(2, '0')}/${String(bulan).padStart(2, '0')}/${fullYear}`,
      jenisKelamin,
      tahunLahir: fullYear
    }
  };
}

/**
 * Format NIK untuk tampilan (dengan pemisah)
 * Contoh: 3174012508900001 -> 31.7401.250890.0001
 */
export function formatNIKDisplay(nik: string): string {
  const cleanNIK = nik.replace(/\D/g, '');
  if (cleanNIK.length !== 16) return nik;
  
  return `${cleanNIK.substring(0, 2)}.${cleanNIK.substring(2, 6)}.${cleanNIK.substring(6, 12)}.${cleanNIK.substring(12, 16)}`;
}

/**
 * Remove formatting from NIK (untuk storage)
 * Contoh: 31.7401.250890.0001 -> 3174012508900001
 */
export function cleanNIK(nik: string): string {
  return nik.replace(/\D/g, '');
}

/**
 * Auto-format NIK input (real-time formatting)
 * Digunakan untuk input field
 */
export function autoFormatNIK(value: string): string {
  const cleaned = value.replace(/\D/g, '');
  const limited = cleaned.substring(0, 16);
  
  let formatted = '';
  for (let i = 0; i < limited.length; i++) {
    if (i === 2 || i === 6 || i === 12) {
      formatted += '.';
    }
    formatted += limited[i];
  }
  
  return formatted;
}

/**
 * Get NIK info for display
 */
export function getNIKInfo(nik: string): string {
  const validation = validateNIKFormat(nik);
  
  if (!validation.isValid || !validation.details) {
    return '';
  }

  const { jenisKelamin, tanggalLahir } = validation.details;
  return `${jenisKelamin} • Lahir: ${tanggalLahir}`;
}

/**
 * Mask NIK for privacy (show only first 6 and last 4 digits)
 * Contoh: 3174012508900001 -> 317401******0001
 */
export function maskNIK(nik: string): string {
  const cleanedNIK = cleanNIK(nik);
  if (cleanedNIK.length !== 16) return nik;
  
  return `${cleanedNIK.substring(0, 6)}******${cleanedNIK.substring(12, 16)}`;
}

/**
 * Validate NIK from OCR result
 * More lenient validation for OCR (allows for OCR errors)
 */
export function validateNIKFromOCR(ocrText: string): { nik: string | null; confidence: 'high' | 'medium' | 'low' } {
  // Try to find 16-digit number in OCR text
  const matches = ocrText.match(/\b\d{16}\b/g);
  
  if (!matches || matches.length === 0) {
    return { nik: null, confidence: 'low' };
  }

  // If multiple matches, take the first one
  const potentialNIK = matches[0];
  
  // Validate the NIK
  const validation = validateNIKFormat(potentialNIK);
  
  if (validation.isValid) {
    return { nik: potentialNIK, confidence: 'high' };
  }

  // If format is correct but validation failed, return with medium confidence
  if (potentialNIK.length === 16 && /^\d{16}$/.test(potentialNIK)) {
    return { nik: potentialNIK, confidence: 'medium' };
  }

  return { nik: null, confidence: 'low' };
}

/**
 * Check if two NIKs match (case-insensitive, whitespace-insensitive)
 */
export function compareNIK(nik1: string, nik2: string): boolean {
  return cleanNIK(nik1) === cleanNIK(nik2);
}
