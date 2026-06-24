/**
 * ========================================
 * CONTOH INTEGRASI API DI DATACONTEXT
 * ========================================
 * 
 * File ini berisi contoh cara mengintegrasikan
 * Google Apps Script API ke DataContext
 * 
 * CARA PAKAI:
 * 1. Copy kode yang dibutuhkan dari file ini
 * 2. Paste ke /src/app/context/DataContext.tsx
 * 3. Replace fungsi localStorage dengan API calls
 * 
 * ========================================
 */

import { api } from '../../lib/api';
import { toast } from 'sonner';

// ========================================
// EXAMPLE 1: Fetch Service Users
// ========================================

// Fetch data dari API saat component mount
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const users = await api.getServiceUsers();
      setServiceUsers(users);
    } catch (error: any) {
      console.error('Failed to fetch service users:', error);
      toast.error('Gagal memuat data', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

// ========================================
// EXAMPLE 2: Add Service User
// ========================================

const addServiceUser = async (userData: Omit<ServiceUser, 'id' | 'createdAt'>) => {
  try {
    // Show loading state
    setIsSubmitting(true);
    
    // Call API to create user
    const newUser = await api.createServiceUser({
      ...userData,
      fieldOfficerId: currentUserId, // Get from auth context
      fieldOfficerName: currentUserName
    });
    
    // Update local state
    setServiceUsers(prev => [newUser, ...prev]);
    
    // Show success message
    toast.success('Data berhasil dikirim!', {
      description: `Pengajuan ${newUser.nama} telah dibuat`
    });
    
    return newUser;
  } catch (error: any) {
    console.error('Failed to add service user:', error);
    toast.error('Gagal mengirim data', {
      description: error.message
    });
    throw error;
  } finally {
    setIsSubmitting(false);
  }
};

// ========================================
// EXAMPLE 3: Update Status
// ========================================

const updateUserStatus = async (
  userId: string, 
  status: ServiceUser['status'], 
  message?: string
) => {
  try {
    // Call API to update status
    const updatedUser = await api.updateServiceUserStatus(
      userId, 
      status, 
      message,
      currentUserId // admin user ID
    );
    
    // Update local state
    setServiceUsers(prev => 
      prev.map(u => u.id === userId ? updatedUser : u)
    );
    
    // Show success message
    toast.success('Status berhasil diupdate', {
      description: `${updatedUser.nama} - ${status}`
    });
    
    return updatedUser;
  } catch (error: any) {
    console.error('Failed to update status:', error);
    toast.error('Gagal update status', {
      description: error.message
    });
    throw error;
  }
};

// ========================================
// EXAMPLE 4: Upload Document with OCR
// ========================================

const uploadDocumentWithOCR = async (
  serviceUserId: string,
  docData: {
    type: 'KTP' | 'KK' | 'NPWP' | 'OTHER';
    imageUrl: string; // base64
    ocrText?: string;
    ocrData?: any;
  }
) => {
  try {
    // Upload to Google Drive via Apps Script
    const document = await api.uploadDocument({
      serviceUserId,
      type: docData.type,
      imageUrl: docData.imageUrl,
      ocrText: docData.ocrText,
      ocrData: docData.ocrData
    });
    
    // Update service user's documents
    setServiceUsers(prev =>
      prev.map(user => {
        if (user.id === serviceUserId) {
          return {
            ...user,
            documents: [...(user.documents || []), document]
          };
        }
        return user;
      })
    );
    
    toast.success('Dokumen berhasil diupload!', {
      description: `${docData.type} - ${document.fileName}`
    });
    
    return document;
  } catch (error: any) {
    console.error('Failed to upload document:', error);
    toast.error('Gagal upload dokumen', {
      description: error.message
    });
    throw error;
  }
};

// ========================================
// EXAMPLE 5: Fetch Notifications
// ========================================

const fetchNotifications = async (userId: string, unreadOnly = false) => {
  try {
    const notifs = await api.getNotifications(userId, unreadOnly);
    setNotifications(notifs);
    
    // Update unread count
    const unreadCount = notifs.filter(n => !n.read).length;
    setUnreadCount(unreadCount);
    
    return notifs;
  } catch (error: any) {
    console.error('Failed to fetch notifications:', error);
    return [];
  }
};

// ========================================
// EXAMPLE 6: Mark Notification as Read
// ========================================

const markNotificationAsRead = async (notificationId: string) => {
  try {
    await api.markNotificationAsRead(notificationId);
    
    // Update local state
    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    // Update unread count
    setUnreadCount(prev => Math.max(0, prev - 1));
  } catch (error: any) {
    console.error('Failed to mark notification as read:', error);
  }
};

// ========================================
// EXAMPLE 7: Complete DataContext with API
// ========================================

// Full example of DataContext with Google Apps Script backend

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ServiceUser, Notification } from '../../lib/api';
import { toast } from 'sonner';

interface DataContextType {
  serviceUsers: ServiceUser[];
  notifications: Notification[];
  loading: boolean;
  isSubmitting: boolean;
  addServiceUser: (user: Omit<ServiceUser, 'id' | 'createdAt'>) => Promise<ServiceUser>;
  updateUserStatus: (userId: string, status: ServiceUser['status'], message?: string) => Promise<void>;
  deleteServiceUser: (userId: string) => Promise<void>;
  fetchNotifications: (userId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  clearAllNotifications: (userId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [serviceUsers, setServiceUsers] = useState<ServiceUser[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get current user from auth context (or localStorage for now)
  const currentUserId = localStorage.getItem('currentUserId') || 'default-user';
  const currentUserName = localStorage.getItem('currentUserName') || 'Field Officer';
  
  // Fetch initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch service users
        const users = await api.getServiceUsers();
        setServiceUsers(users);
        
        // Fetch notifications
        const notifs = await api.getNotifications(currentUserId);
        setNotifications(notifs);
      } catch (error: any) {
        console.error('Failed to load data:', error);
        toast.error('Gagal memuat data', {
          description: 'Pastikan backend sudah dikonfigurasi dengan benar'
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Add service user
  const addServiceUser = async (userData: Omit<ServiceUser, 'id' | 'createdAt'>) => {
    try {
      setIsSubmitting(true);
      
      const newUser = await api.createServiceUser({
        ...userData,
        fieldOfficerId: currentUserId,
        fieldOfficerName: currentUserName
      });
      
      setServiceUsers(prev => [newUser, ...prev]);
      
      toast.success('Data berhasil dikirim!', {
        description: `Pengajuan ${newUser.nama} telah dibuat`
      });
      
      return newUser;
    } catch (error: any) {
      console.error('Failed to add service user:', error);
      toast.error('Gagal mengirim data', {
        description: error.message
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Update user status
  const updateUserStatus = async (
    userId: string, 
    status: ServiceUser['status'], 
    message?: string
  ) => {
    try {
      const updatedUser = await api.updateServiceUserStatus(
        userId, 
        status, 
        message,
        currentUserId
      );
      
      setServiceUsers(prev => 
        prev.map(u => u.id === userId ? updatedUser : u)
      );
      
      toast.success('Status berhasil diupdate');
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error('Gagal update status', {
        description: error.message
      });
      throw error;
    }
  };
  
  // Delete service user
  const deleteServiceUser = async (userId: string) => {
    try {
      await api.deleteServiceUser(userId, currentUserId);
      
      setServiceUsers(prev => prev.filter(u => u.id !== userId));
      
      toast.success('Data berhasil dihapus');
    } catch (error: any) {
      console.error('Failed to delete service user:', error);
      toast.error('Gagal menghapus data', {
        description: error.message
      });
      throw error;
    }
  };
  
  // Fetch notifications
  const fetchNotifications = async (userId: string) => {
    try {
      const notifs = await api.getNotifications(userId);
      setNotifications(notifs);
    } catch (error: any) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
    } catch (error: any) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  // Clear all notifications
  const clearAllNotifications = async (userId: string) => {
    // Note: You need to add this endpoint to Apps Script if you want batch delete
    // For now, mark all as read
    try {
      const unreadNotifs = notifications.filter(n => !n.read);
      
      await Promise.all(
        unreadNotifs.map(n => api.markNotificationAsRead(n.id))
      );
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      
      toast.success('Semua notifikasi telah dibaca');
    } catch (error: any) {
      console.error('Failed to clear notifications:', error);
      toast.error('Gagal clear notifikasi');
    }
  };
  
  // Update document title with unread count
  useEffect(() => {
    const unreadCount = notifications.filter(n => !n.read).length;
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Field-to-Office Sync`;
    } else {
      document.title = 'Field-to-Office Sync';
    }
  }, [notifications]);
  
  const value = {
    serviceUsers,
    notifications,
    loading,
    isSubmitting,
    addServiceUser,
    updateUserStatus,
    deleteServiceUser,
    fetchNotifications,
    markNotificationAsRead,
    clearAllNotifications,
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// ========================================
// EXAMPLE 8: Using in Components
// ========================================

// In DataCollectionForm.tsx
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router';

function DataCollectionForm() {
  const { addServiceUser, isSubmitting } = useData();
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    try {
      const formData = {
        nama: `Pemeriksaan Jenazah - ${waktuTempat.tanggal}`,
        nik: '-',
        alamat: waktuTempat.lokasi,
        noTelepon: '-',
        email: '-',
        jenisLayanan: 'Pemeriksaan dan Pengepakan Jenazah',
        keterangan: `Kesimpulan: ${kesimpulan}`,
        status: 'pending' as const,
        documents: documents
      };
      
      await addServiceUser(formData);
      
      // Navigate after successful submission
      setTimeout(() => {
        navigate('/field-officer');
      }, 1500);
    } catch (error) {
      // Error already handled in context
    }
  };
  
  return (
    <form>
      {/* ... form fields ... */}
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Laporan'}
      </Button>
    </form>
  );
}

// In AdminDashboard.tsx
import { useData } from '../context/DataContext';

function AdminDashboard() {
  const { serviceUsers, updateUserStatus, loading } = useData();
  
  const handleVerify = async (userId: string) => {
    await updateUserStatus(
      userId, 
      'verified',
      'Data telah diverifikasi dan disetujui'
    );
  };
  
  const handleReject = async (userId: string, reason: string) => {
    await updateUserStatus(
      userId,
      'rejected',
      reason
    );
  };
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {serviceUsers.map(user => (
        <div key={user.id}>
          <h3>{user.nama}</h3>
          <p>Status: {user.status}</p>
          <Button onClick={() => handleVerify(user.id)}>
            Verify
          </Button>
          <Button onClick={() => handleReject(user.id, 'Dokumen tidak lengkap')}>
            Reject
          </Button>
        </div>
      ))}
    </div>
  );
}

// ========================================
// NOTES
// ========================================

/**
 * IMPORTANT:
 * 
 * 1. Ganti localStorage dengan API calls
 * 2. Add loading states untuk UX yang lebih baik
 * 3. Handle errors dengan toast notifications
 * 4. Keep local state in sync dengan backend
 * 5. Consider adding optimistic updates untuk UX
 * 6. Add retry logic untuk failed requests
 * 7. Implement proper authentication flow
 * 8. Cache data untuk reduce API calls
 * 
 */
