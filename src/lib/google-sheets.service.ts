/**
 * ========================================
 * GOOGLE SHEETS SERVICE
 * ========================================
 * 
 * Helper service untuk memudahkan interaksi dengan Google Sheets
 * melalui Google Apps Script backend
 * 
 */

import api from './api';

export interface GoogleSheetsConfig {
  apiUrl: string;
  apiKey: string;
  isConfigured: boolean;
}

/**
 * Get current configuration
 */
export function getConfig(): GoogleSheetsConfig {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  const apiKey = import.meta.env.VITE_API_KEY || '';
  
  return {
    apiUrl,
    apiKey,
    isConfigured: Boolean(apiUrl && apiKey),
  };
}

/**
 * Check if Google Sheets API is configured and working
 */
export async function checkConnection(): Promise<boolean> {
  try {
    await api.getServiceUsers();
    return true;
  } catch (error) {
    console.error('Google Sheets connection failed:', error);
    return false;
  }
}

/**
 * Get configuration status with details
 */
export function getConfigStatus() {
  const config = getConfig();
  
  return {
    isConfigured: config.isConfigured,
    hasUrl: Boolean(config.apiUrl),
    hasKey: Boolean(config.apiKey),
    message: config.isConfigured 
      ? 'Google Sheets API terkonfigurasi' 
      : 'Google Sheets API belum dikonfigurasi. Buat file .env dengan VITE_API_URL dan VITE_API_KEY',
  };
}

/**
 * Sync service user to Google Sheets
 */
export async function syncServiceUser(userData: any) {
  try {
    const result = await api.createServiceUser(userData);
    return {
      success: true,
      data: result,
      message: 'Data berhasil disinkronkan ke Google Sheets',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Gagal menyinkronkan data ke Google Sheets',
    };
  }
}

/**
 * Upload document to Google Drive
 */
export async function uploadDocument(data: {
  serviceUserId: string;
  type: 'KTP' | 'KK' | 'NPWP' | 'OTHER';
  imageUrl: string;
  ocrText?: string;
  ocrData?: any;
}) {
  try {
    const result = await api.uploadDocument(data);
    return {
      success: true,
      data: result,
      fileUrl: result.fileUrl,
      message: 'Dokumen berhasil diupload ke Google Drive',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Gagal mengupload dokumen ke Google Drive',
    };
  }
}

/**
 * Update status with Google Sheets sync
 */
export async function updateStatus(
  userId: string, 
  status: 'pending' | 'verified' | 'rejected' | 'incomplete',
  message?: string,
  adminId?: string
) {
  try {
    const result = await api.updateServiceUserStatus(userId, status, message, adminId);
    return {
      success: true,
      data: result,
      message: 'Status berhasil diupdate di Google Sheets',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      message: 'Gagal mengupdate status di Google Sheets',
    };
  }
}

/**
 * Get all service users from Google Sheets
 */
export async function getAllServiceUsers(filters?: {
  status?: string;
  fieldOfficerId?: string;
}) {
  try {
    const users = await api.getServiceUsers(filters);
    return {
      success: true,
      data: users,
      count: users.length,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      data: [],
      count: 0,
    };
  }
}

/**
 * Get notifications from Google Sheets
 */
export async function getNotifications(userId: string, unreadOnly = false) {
  try {
    const notifications = await api.getNotifications(userId, unreadOnly);
    return {
      success: true,
      data: notifications,
      count: notifications.length,
      unreadCount: notifications.filter((n: any) => !n.read).length,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      data: [],
      count: 0,
      unreadCount: 0,
    };
  }
}

/**
 * Export data as CSV (for backup)
 */
export function exportToCSV(data: any[], filename: string) {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values with commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Format date for Google Sheets (ISO string)
 */
export function formatDateForSheets(date: Date): string {
  return date.toISOString();
}

/**
 * Parse date from Google Sheets
 */
export function parseDateFromSheets(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Convert document for Google Sheets storage
 */
export function prepareDocumentForUpload(document: {
  type: string;
  imageUrl: string;
  ocrText?: string;
  ocrData?: any;
}) {
  return {
    type: document.type,
    imageUrl: document.imageUrl,
    ocrText: document.ocrText || '',
    ocrData: document.ocrData || {},
  };
}

/**
 * Validate configuration before making API calls
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const config = getConfig();
  const errors: string[] = [];

  if (!config.apiUrl) {
    errors.push('VITE_API_URL tidak ditemukan di .env');
  } else if (!config.apiUrl.includes('script.google.com')) {
    errors.push('VITE_API_URL harus berupa URL Google Apps Script');
  }

  if (!config.apiKey) {
    errors.push('VITE_API_KEY tidak ditemukan di .env');
  } else if (config.apiKey.length < 10) {
    errors.push('VITE_API_KEY terlalu pendek (minimal 10 karakter)');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Export everything as default service object
export default {
  getConfig,
  checkConnection,
  getConfigStatus,
  syncServiceUser,
  uploadDocument,
  updateStatus,
  getAllServiceUsers,
  getNotifications,
  exportToCSV,
  formatDateForSheets,
  parseDateFromSheets,
  prepareDocumentForUpload,
  validateConfig,
};
