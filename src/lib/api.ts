/**
 * ========================================
 * GOOGLE APPS SCRIPT API CLIENT
 * ========================================
 * 
 * Client untuk berkomunikasi dengan Google Apps Script backend
 * 
 * SETUP:
 * 1. Copy file ini ke: src/lib/api.ts
 * 2. Update .env dengan API_URL dan API_KEY
 * 3. Import dan gunakan di DataContext
 * 
 * ========================================
 */

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Only log info in development mode, not production
// And only once per session to avoid spam
if ((!API_URL || !API_KEY) && import.meta.env.DEV) {
  const hasSeenWarning = sessionStorage.getItem('api-config-info-seen');
  if (!hasSeenWarning) {
    // Friendly info message - NOT an error
    console.log('%c💡 Development Mode Active', 'background: #17A2B8; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
    console.log('%cℹ️ Google Sheets API not configured - using localStorage', 'color: #17A2B8;');
    console.log('%c📖 To enable cloud sync: See PANDUAN_CEPAT_GOOGLE_SHEETS.md', 'color: #666;');
    console.log('');
    sessionStorage.setItem('api-config-info-seen', 'true');
  }
}

// ========================================
// TYPES
// ========================================

export interface ServiceUser {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noTelepon: string;
  email: string;
  jenisLayanan: string;
  keterangan: string;
  status: 'pending' | 'verified' | 'rejected' | 'incomplete';
  statusMessage?: string;
  fieldOfficerId: string;
  fieldOfficerName: string;
  documents?: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  serviceUserId: string;
  type: 'KTP' | 'KK' | 'NPWP' | 'OTHER';
  fileName: string;
  fileId: string;
  fileUrl: string;
  ocrText?: string;
  ocrData?: {
    nik?: string;
    nama?: string;
    tanggalLahir?: string;
  };
  uploadedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  serviceUserId?: string;
  userName: string;
  message: string;
  type: 'new' | 'status-change' | 'system';
  read: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'field_officer';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

interface ApiRequest {
  action: string;
  method?: 'GET' | 'POST';
  [key: string]: any;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

// ========================================
// CORE API FUNCTION
// ========================================

/**
 * Call Google Apps Script API
 */
async function callApi<T = any>(request: ApiRequest): Promise<T> {
  // Check if API is configured
  if (!API_URL || !API_KEY) {
    throw new Error('Google Sheets API not configured. App is running in local mode.');
  }

  const isGet = request.method === 'GET' || !request.method;
  
  let url = API_URL;
  
  // Build URL for GET requests
  if (isGet) {
    const params: Record<string, string> = {
      apiKey: API_KEY,
      action: request.action,
    };
    
    // Add other parameters
    Object.keys(request).forEach(key => {
      if (key !== 'action' && key !== 'method') {
        params[key] = String(request[key]);
      }
    });
    
    const queryString = new URLSearchParams(params).toString();
    url += '?' + queryString;
  }
  
  const options: RequestInit = {
    method: isGet ? 'GET' : 'POST',
  };
  
  // Build body for POST requests
  if (!isGet) {
    const body: any = {
      apiKey: API_KEY,
    };
    
    Object.keys(request).forEach(key => {
      if (key !== 'method') {
        body[key] = request[key];
      }
    });
    
    options.body = JSON.stringify(body);
    options.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: ApiResponse<T> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data.data as T;
  } catch (error: any) {
    // Don't log errors for expected behavior (e.g., not configured)
    if (!error.message.includes('not configured')) {
      console.error('API Error:', {
        action: request.action,
        error: error.message,
        request
      });
    }
    throw error;
  }
}

// ========================================
// API METHODS
// ========================================

export const api = {
  // ========================================
  // SERVICE USERS
  // ========================================
  
  /**
   * Get all service users
   */
  getServiceUsers: async (params?: { 
    status?: string; 
    fieldOfficerId?: string;
  }): Promise<ServiceUser[]> => {
    return callApi({
      action: 'getServiceUsers',
      ...params
    });
  },
  
  /**
   * Get service user by ID
   */
  getServiceUserById: async (id: string): Promise<ServiceUser> => {
    if (!id) throw new Error('User ID is required');
    
    return callApi({
      action: 'getServiceUserById',
      id
    });
  },
  
  /**
   * Create new service user
   */
  createServiceUser: async (data: Partial<ServiceUser>): Promise<ServiceUser> => {
    if (!data.nama || !data.nik) {
      throw new Error('Required fields: nama, nik');
    }
    
    return callApi({
      action: 'createServiceUser',
      method: 'POST',
      data
    });
  },
  
  /**
   * Update service user status
   */
  updateServiceUserStatus: async (
    id: string, 
    status: ServiceUser['status'], 
    statusMessage?: string,
    userId?: string
  ): Promise<ServiceUser> => {
    if (!id || !status) {
      throw new Error('Required fields: id, status');
    }
    
    return callApi({
      action: 'updateServiceUserStatus',
      method: 'POST',
      id,
      status,
      statusMessage: statusMessage || '',
      userId: userId || ''
    });
  },
  
  /**
   * Delete service user
   */
  deleteServiceUser: async (id: string, userId?: string): Promise<{ success: boolean; message: string }> => {
    if (!id) throw new Error('User ID is required');
    
    return callApi({
      action: 'deleteServiceUser',
      id,
      userId: userId || ''
    });
  },
  
  // ========================================
  // DOCUMENTS
  // ========================================
  
  /**
   * Upload document
   */
  uploadDocument: async (data: {
    serviceUserId: string;
    type: Document['type'];
    imageUrl: string; // base64
    ocrText?: string;
    ocrData?: Document['ocrData'];
  }): Promise<Document> => {
    if (!data.serviceUserId || !data.type || !data.imageUrl) {
      throw new Error('Required fields: serviceUserId, type, imageUrl');
    }
    
    return callApi({
      action: 'uploadDocument',
      method: 'POST',
      data
    });
  },
  
  /**
   * Get documents (optionally filter by user)
   */
  getDocuments: async (serviceUserId?: string): Promise<Document[]> => {
    return callApi({
      action: 'getDocuments',
      serviceUserId
    });
  },
  
  /**
   * Delete document
   */
  deleteDocument: async (id: string): Promise<{ success: boolean; message: string }> => {
    if (!id) throw new Error('Document ID is required');
    
    return callApi({
      action: 'deleteDocument',
      id
    });
  },
  
  // ========================================
  // NOTIFICATIONS
  // ========================================
  
  /**
   * Get notifications
   */
  getNotifications: async (
    userId?: string, 
    unreadOnly?: boolean
  ): Promise<Notification[]> => {
    return callApi({
      action: 'getNotifications',
      userId,
      unreadOnly: unreadOnly ? 'true' : 'false'
    });
  },
  
  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (id: string): Promise<{ success: boolean; message: string }> => {
    if (!id) throw new Error('Notification ID is required');
    
    return callApi({
      action: 'markNotificationAsRead',
      id
    });
  },
  
  /**
   * Create notification
   */
  createNotification: async (data: {
    userId: string;
    serviceUserId?: string;
    userName?: string;
    message: string;
    type?: Notification['type'];
  }): Promise<Notification> => {
    if (!data.userId || !data.message) {
      throw new Error('Required fields: userId, message');
    }
    
    return callApi({
      action: 'createNotification',
      method: 'POST',
      data
    });
  },
  
  // ========================================
  // USERS & AUTHENTICATION
  // ========================================
  
  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    return callApi({
      action: 'login',
      method: 'POST',
      email,
      password
    });
  },
  
  /**
   * Get user by ID
   */
  getUser: async (id: string): Promise<User> => {
    if (!id) throw new Error('User ID is required');
    
    return callApi({
      action: 'getUser',
      id
    });
  },
};

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Check if API is configured
 */
export function isApiConfigured(): boolean {
  return Boolean(API_URL && API_KEY);
}

/**
 * Get API configuration
 */
export function getApiConfig() {
  return {
    url: API_URL,
    hasKey: Boolean(API_KEY),
    isConfigured: isApiConfigured()
  };
}

/**
 * Test API connection
 */
export async function testApiConnection(): Promise<boolean> {
  try {
    await api.getServiceUsers();
    return true;
  } catch (error) {
    // Don't log error if API is not configured (expected in dev mode)
    if (!isApiConfigured()) {
      return false;
    }
    console.error('API connection test failed:', error);
    return false;
  }
}

// ========================================
// EXPORT
// ========================================

export default api;
