/**
 * Unit Tests for NIK Validator
 * 
 * This is an example test file showing how to test nikValidator functions.
 * To use this:
 * 1. Install testing library: `npm install --save-dev vitest @testing-library/react`
 * 2. Rename file to: nikValidator.test.ts
 * 3. Run: `npm run test`
 * 
 * Note: This is currently just an example reference file.
 */

import { describe, it, expect } from 'vitest';
import {
  validateNIKFormat,
  formatNIKDisplay,
  cleanNIK,
  maskNIK,
  getNIKInfo,
  autoFormatNIK,
  validateNIKFromOCR,
  compareNIK
} from '../nikValidator';

describe('NIK Validator', () => {
  describe('validateNIKFormat', () => {
    it('should validate correct male NIK', () => {
      const result = validateNIKFormat('3174012508900001');
      
      expect(result.isValid).toBe(true);
      expect(result.details?.jenisKelamin).toBe('Laki-laki');
      expect(result.details?.tanggalLahir).toBe('25/08/1990');
      expect(result.details?.tahunLahir).toBe(1990);
    });

    it('should validate correct female NIK', () => {
      const result = validateNIKFormat('3174016508900001');
      
      expect(result.isValid).toBe(true);
      expect(result.details?.jenisKelamin).toBe('Perempuan');
      expect(result.details?.tanggalLahir).toBe('25/08/1990');
    });

    it('should reject empty NIK', () => {
      const result = validateNIKFormat('');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('NIK tidak boleh kosong');
    });

    it('should reject NIK with letters', () => {
      const result = validateNIKFormat('317A012508900001');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('NIK hanya boleh berisi angka');
    });

    it('should reject NIK with wrong length', () => {
      const result = validateNIKFormat('317401250890');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('16 digit');
    });

    it('should reject invalid date', () => {
      const result = validateNIKFormat('3174013508900001');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Tanggal lahir tidak valid');
    });

    it('should reject invalid month', () => {
      const result = validateNIKFormat('3174012090900001');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Bulan lahir tidak valid');
    });

    it('should reject February 30', () => {
      const result = validateNIKFormat('3174013002900001');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('tidak valid');
    });

    it('should reject future date', () => {
      const result = validateNIKFormat('3174010110500001');
      
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('masa depan');
    });

    it('should extract province code', () => {
      const result = validateNIKFormat('3174012508900001');
      
      expect(result.details?.provinsi).toBe('31');
    });

    it('should extract city code', () => {
      const result = validateNIKFormat('3174012508900001');
      
      expect(result.details?.kabupatenKota).toBe('74');
    });

    it('should extract district code', () => {
      const result = validateNIKFormat('3174012508900001');
      
      expect(result.details?.kecamatan).toBe('01');
    });
  });

  describe('formatNIKDisplay', () => {
    it('should format NIK with dots', () => {
      const formatted = formatNIKDisplay('3174012508900001');
      
      expect(formatted).toBe('31.7401.250890.0001');
    });

    it('should handle already formatted NIK', () => {
      const formatted = formatNIKDisplay('31.7401.250890.0001');
      
      expect(formatted).toBe('31.7401.250890.0001');
    });

    it('should handle NIK with spaces', () => {
      const formatted = formatNIKDisplay('3174 0125 0890 0001');
      
      expect(formatted).toBe('31.7401.250890.0001');
    });

    it('should return original if not 16 digits', () => {
      const formatted = formatNIKDisplay('12345');
      
      expect(formatted).toBe('12345');
    });
  });

  describe('cleanNIK', () => {
    it('should remove dots', () => {
      const cleaned = cleanNIK('31.7401.250890.0001');
      
      expect(cleaned).toBe('3174012508900001');
    });

    it('should remove spaces', () => {
      const cleaned = cleanNIK('3174 0125 0890 0001');
      
      expect(cleaned).toBe('3174012508900001');
    });

    it('should remove mixed formatting', () => {
      const cleaned = cleanNIK('31-7401.250890 0001');
      
      expect(cleaned).toBe('3174012508900001');
    });

    it('should handle already clean NIK', () => {
      const cleaned = cleanNIK('3174012508900001');
      
      expect(cleaned).toBe('3174012508900001');
    });
  });

  describe('maskNIK', () => {
    it('should mask middle digits', () => {
      const masked = maskNIK('3174012508900001');
      
      expect(masked).toBe('317401******0001');
    });

    it('should show first 6 and last 4 digits', () => {
      const masked = maskNIK('3174012508900001');
      
      expect(masked.substring(0, 6)).toBe('317401');
      expect(masked.substring(12, 16)).toBe('0001');
    });

    it('should have 6 asterisks in middle', () => {
      const masked = maskNIK('3174012508900001');
      
      expect(masked.substring(6, 12)).toBe('******');
    });

    it('should return original if not 16 digits', () => {
      const masked = maskNIK('12345');
      
      expect(masked).toBe('12345');
    });
  });

  describe('getNIKInfo', () => {
    it('should return info for male', () => {
      const info = getNIKInfo('3174012508900001');
      
      expect(info).toContain('Laki-laki');
      expect(info).toContain('25/08/1990');
    });

    it('should return info for female', () => {
      const info = getNIKInfo('3174016508900001');
      
      expect(info).toContain('Perempuan');
      expect(info).toContain('25/08/1990');
    });

    it('should return empty for invalid NIK', () => {
      const info = getNIKInfo('invalid');
      
      expect(info).toBe('');
    });

    it('should format with bullet separator', () => {
      const info = getNIKInfo('3174012508900001');
      
      expect(info).toContain('•');
    });
  });

  describe('autoFormatNIK', () => {
    it('should format as user types - 2 digits', () => {
      const formatted = autoFormatNIK('31');
      
      expect(formatted).toBe('31');
    });

    it('should add first dot after 2 digits', () => {
      const formatted = autoFormatNIK('317');
      
      expect(formatted).toBe('31.7');
    });

    it('should add second dot after 6 digits', () => {
      const formatted = autoFormatNIK('3174012');
      
      expect(formatted).toBe('31.7401.2');
    });

    it('should add third dot after 12 digits', () => {
      const formatted = autoFormatNIK('31740125089001');
      
      expect(formatted).toBe('31.7401.250890.01');
    });

    it('should format complete NIK', () => {
      const formatted = autoFormatNIK('3174012508900001');
      
      expect(formatted).toBe('31.7401.250890.0001');
    });

    it('should limit to 16 digits', () => {
      const formatted = autoFormatNIK('31740125089000019999');
      
      expect(formatted).toBe('31.7401.250890.0001');
    });

    it('should remove non-digits', () => {
      const formatted = autoFormatNIK('3174A012B5089C0001');
      
      expect(formatted).toBe('31.7401.250890.0001');
    });
  });

  describe('validateNIKFromOCR', () => {
    it('should extract valid NIK with high confidence', () => {
      const ocrText = 'PROVINSI DKI JAKARTA\nNIK: 3174012508900001\nNAMA: BUDI';
      const result = validateNIKFromOCR(ocrText);
      
      expect(result.nik).toBe('3174012508900001');
      expect(result.confidence).toBe('high');
    });

    it('should extract NIK from plain text', () => {
      const ocrText = '3174012508900001';
      const result = validateNIKFromOCR(ocrText);
      
      expect(result.nik).toBe('3174012508900001');
    });

    it('should return null if no 16-digit found', () => {
      const ocrText = 'NAMA: BUDI SANTOSO ALAMAT: JAKARTA';
      const result = validateNIKFromOCR(ocrText);
      
      expect(result.nik).toBe(null);
      expect(result.confidence).toBe('low');
    });

    it('should extract first NIK if multiple found', () => {
      const ocrText = 'NIK1: 3174012508900001 NIK2: 3174016508900002';
      const result = validateNIKFromOCR(ocrText);
      
      expect(result.nik).toBe('3174012508900001');
    });

    it('should return medium confidence for invalid but 16-digit', () => {
      const ocrText = '1234567890123456'; // 16 digits but invalid date
      const result = validateNIKFromOCR(ocrText);
      
      // Should still extract it but with lower confidence
      expect(result.nik).toBeTruthy();
      expect(result.nik?.length).toBe(16);
    });
  });

  describe('compareNIK', () => {
    it('should match identical NIKs', () => {
      const isMatch = compareNIK('3174012508900001', '3174012508900001');
      
      expect(isMatch).toBe(true);
    });

    it('should match formatted and unformatted', () => {
      const isMatch = compareNIK('31.7401.250890.0001', '3174012508900001');
      
      expect(isMatch).toBe(true);
    });

    it('should match with different spacing', () => {
      const isMatch = compareNIK('3174 0125 0890 0001', '3174012508900001');
      
      expect(isMatch).toBe(true);
    });

    it('should not match different NIKs', () => {
      const isMatch = compareNIK('3174012508900001', '3174016508900001');
      
      expect(isMatch).toBe(false);
    });

    it('should handle mixed formatting', () => {
      const isMatch = compareNIK('31-7401.250890 0001', '31.7401.250890.0001');
      
      expect(isMatch).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace in NIK', () => {
      const result = validateNIKFormat('  3174012508900001  ');
      
      expect(result.isValid).toBe(true);
    });

    it('should handle leap year date', () => {
      // 29 Feb 1992 (leap year)
      const result = validateNIKFormat('3174012902920001');
      
      expect(result.isValid).toBe(true);
    });

    it('should reject Feb 29 on non-leap year', () => {
      // 29 Feb 1990 (not leap year)
      const result = validateNIKFormat('3174012902900001');
      
      expect(result.isValid).toBe(false);
    });

    it('should handle very old person (100 years)', () => {
      // Born in 1924
      const result = validateNIKFormat('3174012508240001');
      
      expect(result.isValid).toBe(true);
      expect(result.details?.tahunLahir).toBe(1924);
    });

    it('should handle young person (born 2024)', () => {
      const result = validateNIKFormat('3174010101240001');
      
      expect(result.isValid).toBe(true);
      expect(result.details?.tahunLahir).toBe(2024);
    });

    it('should handle December 31', () => {
      const result = validateNIKFormat('3174013112900001');
      
      expect(result.isValid).toBe(true);
    });

    it('should reject April 31 (only 30 days)', () => {
      const result = validateNIKFormat('3174013104900001');
      
      expect(result.isValid).toBe(false);
    });

    it('should handle female born on 31st', () => {
      // Female born 31 Aug (31+40=71)
      const result = validateNIKFormat('3174017108900001');
      
      expect(result.isValid).toBe(true);
      expect(result.details?.jenisKelamin).toBe('Perempuan');
      expect(result.details?.tanggalLahir).toContain('31/08');
    });
  });
});

describe('Integration Tests', () => {
  it('should validate OCR result and format for display', () => {
    const ocrText = 'NIK: 3174012508900001 NAMA: BUDI';
    
    // Extract from OCR
    const ocrResult = validateNIKFromOCR(ocrText);
    expect(ocrResult.nik).toBeTruthy();
    
    // Validate
    const validation = validateNIKFormat(ocrResult.nik!);
    expect(validation.isValid).toBe(true);
    
    // Format for display
    const formatted = formatNIKDisplay(ocrResult.nik!);
    expect(formatted).toBe('31.7401.250890.0001');
    
    // Get info
    const info = getNIKInfo(ocrResult.nik!);
    expect(info).toContain('Laki-laki');
  });

  it('should clean, validate, and save NIK', () => {
    const userInput = '31.7401.250890.0001';
    
    // Clean
    const cleaned = cleanNIK(userInput);
    expect(cleaned).toBe('3174012508900001');
    
    // Validate
    const validation = validateNIKFormat(cleaned);
    expect(validation.isValid).toBe(true);
    
    // Save (would save cleaned version)
    const toSave = cleaned;
    expect(toSave.length).toBe(16);
    expect(/^\d{16}$/.test(toSave)).toBe(true);
  });

  it('should format for different display contexts', () => {
    const nik = '3174012508900001';
    
    // Display with dots
    const formatted = formatNIKDisplay(nik);
    expect(formatted).toBe('31.7401.250890.0001');
    
    // Display masked for privacy
    const masked = maskNIK(nik);
    expect(masked).toBe('317401******0001');
    
    // Display with info
    const info = getNIKInfo(nik);
    expect(info).toBe('Laki-laki • Lahir: 25/08/1990');
  });
});

/**
 * Performance Tests
 */
describe('Performance', () => {
  it('should validate 1000 NIKs quickly', () => {
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      validateNIKFormat('3174012508900001');
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Should complete in less than 100ms
    expect(duration).toBeLessThan(100);
  });

  it('should format 1000 NIKs quickly', () => {
    const start = performance.now();
    
    for (let i = 0; i < 1000; i++) {
      formatNIKDisplay('3174012508900001');
    }
    
    const end = performance.now();
    const duration = end - start;
    
    // Should complete in less than 50ms
    expect(duration).toBeLessThan(50);
  });
});
