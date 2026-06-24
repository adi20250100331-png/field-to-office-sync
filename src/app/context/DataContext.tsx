import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api, { isApiConfigured } from '../../lib/api';
import { toast } from 'sonner';
import { validateNIKFormat } from '../utils/nikValidator';

// Types
export interface Document {
  id: string;
  type: 'KTP' | 'KK' | 'NPWP' | 'OTHER';
  imageUrl: string;
  ocrData?: {
    nik?: string;
    nama?: string;
    tanggalLahir?: string;
  };
  ocrText?: string;
  uploadedAt: Date;
}

export interface ServiceUser {
  id: string;
  nama: string;
  nik: string;
  alamat: string;
  noTelepon: string;
  email: string;
  jenisLayanan: string;
  keterangan: string;
  documents: Document[];
  status: 'pending' | 'verified' | 'rejected' | 'incomplete';
  statusMessage?: string;
  createdAt: Date;
  fieldOfficerId: string;
  fieldOfficerName: string;
}

export interface Notification {
  id: string;
  type: 'verification' | 'message';
  title: string;
  message: string;
  userId: string;
  timestamp: Date;
  read: boolean;
}

interface DataContextType {
  serviceUsers: ServiceUser[];
  notifications: Notification[];
  isLoading: boolean;
  addServiceUser: (user: Omit<ServiceUser, 'id' | 'createdAt' | 'fieldOfficerId' | 'fieldOfficerName'>) => Promise<void>;
  updateServiceUserStatus: (userId: string, status: ServiceUser['status'], message?: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Sample data for fallback when API is not configured
const sampleData: ServiceUser[] = [
  {
    id: 'user-001',
    nama: 'Budi Santoso',
    nik: '3174012508900001',
    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
    noTelepon: '081234567890',
    email: 'budi.santoso@email.com',
    jenisLayanan: 'Pendaftaran Baru',
    keterangan: 'Pendaftaran layanan baru untuk usaha',
    documents: [
      {
        id: 'doc-001',
        type: 'KTP',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800',
        ocrData: {
          nik: '3174012508900001',
          nama: 'BUDI SANTOSO',
          tanggalLahir: '25-08-1990',
        },
        uploadedAt: new Date('2026-02-24T09:30:00'),
      },
    ],
    status: 'pending',
    createdAt: new Date('2026-02-24T09:30:00'),
    fieldOfficerId: 'officer-001',
    fieldOfficerName: 'Adhy',
  },
];

const STORAGE_KEY = 'field-office-submissions';
const NOTIFICATIONS_KEY = 'field-office-notifications';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Load initial data from localStorage or use sample data
  const loadStoredData = (): ServiceUser[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          documents: item.documents.map((doc: any) => ({
            ...doc,
            uploadedAt: new Date(doc.uploadedAt)
          }))
        }));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    return sampleData;
  };

  const loadStoredNotifications = (): Notification[] => {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
    return [];
  };

  const [serviceUsers, setServiceUsers] = useState<ServiceUser[]>(loadStoredData);
  const [notifications, setNotifications] = useState<Notification[]>(loadStoredNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [useApi, setUseApi] = useState(false);

  // Save to localStorage whenever serviceUsers changes
  useEffect(() => {
    if (!useApi && serviceUsers.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(serviceUsers));
        console.log('💾 Data saved to localStorage:', serviceUsers.length, 'submissions');
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  }, [serviceUsers, useApi]);

  // Save notifications to localStorage
  useEffect(() => {
    if (!useApi && notifications.length > 0) {
      try {
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      } catch (error) {
        console.error('Error saving notifications to localStorage:', error);
      }
    }
  }, [notifications, useApi]);

  // Check if API is configured
  useEffect(() => {
    const apiConfigured = isApiConfigured();
    setUseApi(apiConfigured);
    
    if (!apiConfigured) {
      console.log('%c🔧 Development Mode', 'background: #17A2B8; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
      console.log('%cℹ️ Aplikasi berjalan dalam Local Mode (data di localStorage)', 'color: #17A2B8; font-weight: bold;');
      console.log('%c📚 Untuk mengaktifkan Google Sheets sync, lihat: PANDUAN_CEPAT_GOOGLE_SHEETS.md', 'color: #666;');
      console.log('');
    } else {
      console.log('%c✅ Google Sheets API Connected', 'background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;');
      console.log('%c📊 Data akan tersinkronisasi dengan Google Sheets & Drive', 'color: #28a745; font-weight: bold;');
      console.log('');
    }
  }, []);

  // Fetch data from API when component mounts
  useEffect(() => {
    if (useApi) {
      refreshData();
    }
  }, [useApi, user]);

  // Update document title based on unread notifications
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Field-to-Office Sync`;
    } else {
      document.title = 'Field-to-Office Sync';
    }
  }, [notifications]);

  // Fetch data from Google Apps Script API
  const refreshData = async () => {
    if (!useApi || !user) return;

    setIsLoading(true);
    try {
      // Fetch service users
      const params: any = {};
      if (user.role === 'field_officer') {
        params.fieldOfficerId = user.id;
      }
      
      const users = await api.getServiceUsers(params);
      
      // Convert dates from string to Date objects
      const convertedUsers = users.map((u: any) => ({
        ...u,
        createdAt: new Date(u.createdAt),
        updatedAt: new Date(u.updatedAt),
        documents: (u.documents || []).map((d: any) => ({
          ...d,
          uploadedAt: new Date(d.uploadedAt),
        })),
      }));
      
      setServiceUsers(convertedUsers);

      // Fetch notifications
      const notifs = await api.getNotifications(user.id);
      const convertedNotifs = notifs.map((n: any) => ({
        id: n.id,
        type: n.type === 'status-change' ? 'verification' : 'message',
        title: n.type === 'new' ? 'Pengajuan Baru' : 'Update Status',
        message: n.message,
        userId: n.userId,
        timestamp: new Date(n.createdAt),
        read: n.read === true || n.read === 'true',
      }));
      
      setNotifications(convertedNotifs);
    } catch (error: any) {
      console.error('Failed to fetch data from API:', error);
      toast.error('Gagal mengambil data', {
        description: 'Menggunakan data lokal sementara',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add service user
  const addServiceUser = async (userData: Omit<ServiceUser, 'id' | 'createdAt' | 'fieldOfficerId' | 'fieldOfficerName'>) => {
    if (!user) return;

    // Validate NIK before submitting
    const nikValidation = validateNIKFormat(userData.nik);
    if (!nikValidation.isValid) {
      toast.error('NIK tidak valid', {
        description: nikValidation.error || 'Pastikan NIK terdiri dari 16 digit angka yang benar',
      });
      return;
    }

    // Create user object for API
    const userDataForApi = {
      nama: userData.nama,
      nik: userData.nik,
      alamat: userData.alamat,
      noTelepon: userData.noTelepon,
      email: userData.email,
      jenisLayanan: userData.jenisLayanan,
      keterangan: userData.keterangan,
      status: userData.status,
      statusMessage: userData.statusMessage,
      fieldOfficerId: user.id,
      fieldOfficerName: user.name,
      documents: userData.documents.map(doc => ({
        type: doc.type,
        imageUrl: doc.imageUrl,
        ocrText: doc.ocrText,
        ocrData: doc.ocrData,
      })),
    };

    if (useApi) {
      // Use API
      try {
        setIsLoading(true);
        const newUser = await api.createServiceUser(userDataForApi);
        
        // Convert dates
        const convertedUser = {
          ...newUser,
          createdAt: new Date(newUser.createdAt),
          updatedAt: new Date(newUser.updatedAt),
          documents: (newUser.documents || []).map((d: any) => ({
            ...d,
            uploadedAt: new Date(d.uploadedAt),
          })),
        };
        
        setServiceUsers(prev => [convertedUser, ...prev]);
        toast.success('Data berhasil dikirim ke Google Sheets!', {
          description: 'Data tersimpan dan dapat diakses oleh admin',
        });
      } catch (error: any) {
        console.error('Failed to create service user:', error);
        toast.error('Gagal mengirim data', {
          description: error.message || 'Terjadi kesalahan saat mengirim data',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use local storage
      const newUser: ServiceUser = {
        ...userData,
        id: `user-${Date.now()}`,
        createdAt: new Date(),
        fieldOfficerId: user.id,
        fieldOfficerName: user.name,
      };
      
      console.log('💾 Saving to localStorage:', newUser);
      
      setServiceUsers(prev => {
        const updated = [newUser, ...prev];
        console.log('✅ Updated serviceUsers:', updated.length, 'total submissions');
        return updated;
      });
      
      toast.success('Data tersimpan lokal', {
        description: 'Setup Google Apps Script untuk sync ke cloud',
      });
    }
  };

  // Update service user status
  const updateServiceUserStatus = async (userId: string, status: ServiceUser['status'], message?: string) => {
    if (useApi) {
      // Use API
      try {
        setIsLoading(true);
        const updatedUser = await api.updateServiceUserStatus(userId, status, message, user?.id);
        
        // Convert dates
        const convertedUser = {
          ...updatedUser,
          createdAt: new Date(updatedUser.createdAt),
          updatedAt: new Date(updatedUser.updatedAt),
          documents: (updatedUser.documents || []).map((d: any) => ({
            ...d,
            uploadedAt: new Date(d.uploadedAt),
          })),
        };
        
        setServiceUsers(prev => 
          prev.map(u => u.id === userId ? convertedUser : u)
        );
        
        toast.success('Status berhasil diupdate di Google Sheets!');
      } catch (error: any) {
        console.error('Failed to update status:', error);
        toast.error('Gagal update status', {
          description: error.message || 'Terjadi kesalahan',
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      // Use local storage
      setServiceUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status, statusMessage: message }
            : user
        )
      );

      // Create notification for field officer
      const serviceUser = serviceUsers.find(u => u.id === userId);
      if (serviceUser) {
        const notification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'verification',
          title: status === 'verified' ? 'Data Diverifikasi' : status === 'rejected' ? 'Data Ditolak' : 'Data Perlu Dilengkapi',
          message: message || `Data ${serviceUser.nama} telah ${status === 'verified' ? 'diverifikasi' : status === 'rejected' ? 'ditolak' : 'memerlukan kelengkapan'}`,
          userId: userId,
          timestamp: new Date(),
          read: false,
        };
        setNotifications(prev => [notification, ...prev]);
      }
      
      toast.success('Status diupdate lokal');
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    // Update in API if configured
    if (useApi) {
      api.markNotificationAsRead(notificationId).catch(error => {
        console.error('Failed to mark notification as read:', error);
      });
    }
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  return (
    <DataContext.Provider value={{
      serviceUsers,
      notifications,
      isLoading,
      addServiceUser,
      updateServiceUserStatus,
      markNotificationAsRead,
      clearAllNotifications,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
