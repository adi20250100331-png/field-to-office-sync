# 🔧 Backend Logic & Architecture Documentation

## 📋 Daftar Isi
1. [Arsitektur Aplikasi](#arsitektur-aplikasi)
2. [State Management](#state-management)
3. [Data Flow](#data-flow)
4. [OCR Processing Logic](#ocr-processing-logic)
5. [Storage & Persistence](#storage--persistence)
6. [Integrasi Backend (Supabase)](#integrasi-backend-supabase)
7. [API Endpoints](#api-endpoints)
8. [Database Schema](#database-schema)
9. [Security & Authentication](#security--authentication)

---

## 🏗️ Arsitektur Aplikasi

### Tech Stack
```
Frontend:
├── React 18.3.1
├── TypeScript
├── React Router 7.13.0 (Data Mode)
├── Tailwind CSS 4.1.12
├── Radix UI (Component Library)
└── Vite 6.3.5 (Build Tool)

OCR & Media:
├── Tesseract.js 7.0.0
├── React Webcam 7.2.0
└── Navigator MediaDevices API

State Management:
└── React Context API

Deployment:
└── Static Site (Netlify/Vercel/Firebase)
```

### Architecture Pattern
```
┌─────────────────────────────────────────────────┐
│                  React App                      │
│  ┌───────────────────────────────────────────┐  │
│  │         React Router (Pages)              │  │
│  │  - HomePage                               │  │
│  │  - FieldOfficerDashboard                  │  │
│  │  - AdminDashboard                         │  │
│  │  - DataCollectionForm                     │  │
│  │  - TechArchitecture                       │  │
│  └───────────────────────────────────────────┘  │
│                      ↓                          │
│  ┌───────────────────────────────────────────┐  │
│  │       Context (Global State)              │  │
│  │  - DataContext: Service Users             │  │
│  │  - Notifications                          │  │
│  │  - Documents & OCR Data                   │  │
│  └───────────────────────────────────────────┘  │
│                      ↓                          │
│  ┌───────────────────────────────────────────┐  │
│  │      Local Services                       │  │
│  │  - OCR Processing (Tesseract)             │  │
│  │  - Webcam Capture                         │  │
│  │  - Browser Storage (localStorage)         │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                      ↓
         (Optional Backend Integration)
                      ↓
┌─────────────────────────────────────────────────┐
│            Backend (Supabase)                   │
│  ┌───────────────────────────────────────────┐  │
│  │  Database (PostgreSQL)                    │  │
│  │  - Users Table                            │  │
│  │  - Documents Table                        │  │
│  │  - Service_Users Table                    │  │
│  │  - Notifications Table                    │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  Storage (S3-compatible)                  │  │
│  │  - Document Images                        │  │
│  │  - User Uploads                           │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  Authentication (Row Level Security)      │  │
│  │  - Field Officer Role                     │  │
│  │  - Admin Role                             │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

## 🔄 State Management

### DataContext Structure
**File**: `/src/app/context/DataContext.tsx`

```typescript
// Data Types
interface Document {
  id: string;
  type: 'KTP' | 'KK' | 'NPWP' | 'OTHER';
  imageUrl: string;
  ocrData?: {
    nik?: string;
    nama?: string;
    tanggalLahir?: string;
  };
  ocrText?: string;        // Raw OCR output
  uploadedAt: Date;
}

interface ServiceUser {
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

interface Notification {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'new' | 'status-change' | 'system';
}

// Context State
interface DataContextType {
  serviceUsers: ServiceUser[];
  notifications: Notification[];
  addServiceUser: (user: Omit<ServiceUser, 'id' | 'createdAt' | 'fieldOfficerId' | 'fieldOfficerName'>) => void;
  updateUserStatus: (userId: string, status: ServiceUser['status'], message?: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
}
```

### State Persistence
```typescript
// Auto-save to localStorage
useEffect(() => {
  localStorage.setItem('serviceUsers', JSON.stringify(serviceUsers));
}, [serviceUsers]);

useEffect(() => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
}, [notifications]);

// Load from localStorage on mount
useEffect(() => {
  const savedUsers = localStorage.getItem('serviceUsers');
  if (savedUsers) {
    setServiceUsers(JSON.parse(savedUsers));
  }
}, []);
```

---

## 📊 Data Flow

### 1. Field Officer Flow
```
User Input → DataCollectionForm
    ↓
Camera Capture → Webcam API
    ↓
Image Processing → Tesseract OCR
    ↓
Data Extraction → Parse NIK, Name, Date
    ↓
Document Storage → localStorage/Supabase Storage
    ↓
Form Submission → DataContext.addServiceUser()
    ↓
Update State → serviceUsers array
    ↓
Create Notification → For admin
    ↓
Navigate → FieldOfficerDashboard
```

### 2. Admin Flow
```
AdminDashboard Load
    ↓
Read State → DataContext.serviceUsers
    ↓
Display List → Pending users
    ↓
User Action → Verify/Reject
    ↓
Update Status → DataContext.updateUserStatus()
    ↓
Update State → serviceUsers array
    ↓
Create Notification → For field officer
    ↓
Persist → localStorage
```

### 3. Notification Flow
```
Event Trigger → (New submission/Status change)
    ↓
Create Notification → DataContext
    ↓
Update Browser Title → Show unread count
    ↓
Display in UI → Notification badge
    ↓
User Reads → markNotificationAsRead()
    ↓
Update State → notifications array
```

---

## 🔍 OCR Processing Logic

### Implementation Details
**File**: `/src/app/pages/DataCollectionForm.tsx`

```typescript
const captureDocument = () => {
  // 1. Capture image from webcam
  const imageSrc = webcamRef.current.getScreenshot();
  
  // 2. Initialize OCR processing
  setIsProcessing(true);
  
  // 3. Run Tesseract OCR
  Tesseract.recognize(
    imageSrc,
    'ind',                    // Indonesian language
    { 
      logger: m => {
        // Track progress
        console.log(`Progress: ${m.progress * 100}%`);
      }
    }
  ).then(({ data: { text } }) => {
    // 4. Extract structured data
    const ocrData = extractDataFromText(text);
    
    // 5. Save document with OCR results
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      type: currentDocType,
      imageUrl: imageSrc,
      uploadedAt: new Date(),
      ocrText: text,           // Raw text
      ocrData: ocrData,        // Structured data
    };
    
    // 6. Update state
    setDocuments(prev => [...prev, newDoc]);
    
    // 7. Show success message
    toast.success(`NIK terdeteksi: ${ocrData.nik}`);
    
  }).catch(err => {
    // Fallback: Save without OCR
    console.error('OCR Error:', err);
    toast.warning('Dokumen tersimpan tanpa OCR');
  });
};
```

### Data Extraction Logic
```typescript
function extractDataFromText(text: string) {
  const ocrData: any = {};
  
  // Extract NIK (16 digits)
  const nikPattern = /\b\d{16}\b/;
  const nikMatch = text.match(nikPattern);
  if (nikMatch) {
    ocrData.nik = nikMatch[0];
  }
  
  // Extract Date (DD-MM-YYYY or DD/MM/YYYY)
  const datePattern = /\b\d{2}[-/]\d{2}[-/]\d{4}\b/;
  const dateMatch = text.match(datePattern);
  if (dateMatch) {
    ocrData.tanggalLahir = dateMatch[0];
  }
  
  // Extract Name (context-based)
  // Look for lines containing "Nama" or "Name"
  const lines = text.split('\n');
  const namaLine = lines.find(line => 
    line.toLowerCase().includes('nama')
  );
  if (namaLine) {
    // Extract text after ":" or "Nama"
    const nameMatch = namaLine.match(/(?:nama|name)[\s:]+(.+)/i);
    if (nameMatch) {
      ocrData.nama = nameMatch[1].trim();
    }
  }
  
  return ocrData;
}
```

### OCR Optimization Tips
```typescript
// 1. Image Preprocessing (Optional)
const preprocessImage = (imageData) => {
  // Convert to grayscale
  // Increase contrast
  // Remove noise
  return processedImage;
};

// 2. Custom OCR Config
const ocrConfig = {
  lang: 'ind',
  tessedit_char_whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz /-',
  tessedit_pageseg_mode: '6', // Assume uniform text
};

// 3. Reduce Image Size
const optimizedImage = resizeImage(imageSrc, {
  maxWidth: 1280,
  maxHeight: 720,
  quality: 0.9
});
```

---

## 💾 Storage & Persistence

### Current Implementation (localStorage)

```typescript
// Save data
localStorage.setItem('serviceUsers', JSON.stringify(serviceUsers));
localStorage.setItem('notifications', JSON.stringify(notifications));

// Load data
const savedUsers = JSON.parse(localStorage.getItem('serviceUsers') || '[]');
const savedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');

// Clear data
localStorage.removeItem('serviceUsers');
localStorage.clear();
```

### Storage Limitations
- **Size Limit**: ~5-10MB per domain
- **Data Type**: String only (need JSON.stringify)
- **Persistence**: Browser-specific (not synced)
- **Security**: Accessible via JavaScript

### Migration to Backend Storage
```typescript
// Replace localStorage with API calls
const addServiceUser = async (user: ServiceUser) => {
  // Save to Supabase
  const { data, error } = await supabase
    .from('service_users')
    .insert([user]);
  
  if (error) throw error;
  
  // Update local state
  setServiceUsers(prev => [...prev, data[0]]);
};
```

---

## 🔗 Integrasi Backend (Supabase)

### Setup Supabase

#### 1. Install Supabase Client
```bash
pnpm add @supabase/supabase-js
```

#### 2. Create Supabase Client
**File**: `/src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### 3. Environment Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Update DataContext with Supabase

```typescript
import { supabase } from '../lib/supabase';

// Fetch data from Supabase
const fetchServiceUsers = async () => {
  const { data, error } = await supabase
    .from('service_users')
    .select(`
      *,
      documents (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  setServiceUsers(data);
};

// Add service user
const addServiceUser = async (user: Omit<ServiceUser, 'id' | 'createdAt'>) => {
  // 1. Upload documents to Supabase Storage
  const uploadedDocs = await Promise.all(
    user.documents.map(async (doc) => {
      const file = dataURLtoFile(doc.imageUrl, `${doc.id}.jpg`);
      
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(`${user.nik}/${doc.id}.jpg`, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: publicData } = supabase.storage
        .from('documents')
        .getPublicUrl(data.path);
      
      return {
        ...doc,
        imageUrl: publicData.publicUrl
      };
    })
  );
  
  // 2. Insert user data
  const { data: userData, error: userError } = await supabase
    .from('service_users')
    .insert([{
      ...user,
      documents: uploadedDocs
    }])
    .select()
    .single();
  
  if (userError) throw userError;
  
  // 3. Create notification
  await supabase
    .from('notifications')
    .insert([{
      user_id: userData.id,
      user_name: userData.nama,
      message: `Pengajuan baru dari ${userData.nama}`,
      type: 'new',
      read: false
    }]);
  
  // 4. Update local state
  setServiceUsers(prev => [...prev, userData]);
  
  toast.success('Data berhasil dikirim!');
};

// Update user status
const updateUserStatus = async (
  userId: string, 
  status: ServiceUser['status'], 
  message?: string
) => {
  const { data, error } = await supabase
    .from('service_users')
    .update({ 
      status, 
      status_message: message,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  
  // Update local state
  setServiceUsers(prev => 
    prev.map(u => u.id === userId ? data : u)
  );
  
  // Create notification for field officer
  await supabase
    .from('notifications')
    .insert([{
      user_id: data.field_officer_id,
      user_name: data.nama,
      message: `Status ${data.nama} diubah menjadi ${status}`,
      type: 'status-change',
      read: false
    }]);
};

// Real-time subscriptions
useEffect(() => {
  // Subscribe to new service users
  const subscription = supabase
    .channel('service_users')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'service_users' 
      }, 
      (payload) => {
        setServiceUsers(prev => [...prev, payload.new]);
        toast.info('Data baru masuk!');
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(subscription);
  };
}, []);
```

---

## 🗄️ Database Schema

### Supabase Tables

#### 1. service_users
```sql
CREATE TABLE service_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  alamat TEXT NOT NULL,
  no_telepon VARCHAR(20),
  email VARCHAR(255),
  jenis_layanan VARCHAR(255) NOT NULL,
  keterangan TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  status_message TEXT,
  field_officer_id UUID REFERENCES auth.users(id),
  field_officer_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_service_users_status ON service_users(status);
CREATE INDEX idx_service_users_field_officer ON service_users(field_officer_id);
CREATE INDEX idx_service_users_created_at ON service_users(created_at DESC);

-- Row Level Security
ALTER TABLE service_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Field officers can insert their own data"
  ON service_users FOR INSERT
  WITH CHECK (auth.uid() = field_officer_id);

CREATE POLICY "Admins can view all data"
  ON service_users FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.uid() = field_officer_id);

CREATE POLICY "Admins can update status"
  ON service_users FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

#### 2. documents
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_user_id UUID REFERENCES service_users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  image_url TEXT NOT NULL,
  ocr_text TEXT,
  ocr_data JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_service_user ON documents(service_user_id);
CREATE INDEX idx_documents_type ON documents(type);

-- Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_users 
      WHERE id = service_user_id 
      AND (field_officer_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );
```

#### 3. notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  service_user_id UUID REFERENCES service_users(id),
  user_name VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'new',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

#### 4. users (extends auth.users)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'field_officer',
  phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Storage Buckets

```sql
-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Storage policies
CREATE POLICY "Users can upload their documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Anyone can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');
```

---

## 🔐 Security & Authentication

### Authentication Flow

```typescript
// Login
const handleLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', data.user.id)
    .single();
  
  // Store in context
  setUser({ ...data.user, profile });
};

// Logout
const handleLogout = async () => {
  await supabase.auth.signOut();
  setUser(null);
};

// Check session
useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setUser(session?.user ?? null);
  });
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (_event, session) => {
      setUser(session?.user ?? null);
    }
  );
  
  return () => subscription.unsubscribe();
}, []);
```

### Protected Routes

```typescript
// AuthProvider
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    checkUser();
  }, []);
  
  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error('Akses ditolak');
      navigate('/');
    }
  }, [user, allowedRoles]);
  
  if (!user) return null;
  
  return <>{children}</>;
}

// Usage in routes
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### Data Sanitization

```typescript
// Sanitize user input
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, ''); // Remove javascript: protocol
}

// Validate NIK
function validateNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik);
}

// Validate email
function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate phone
function validatePhone(phone: string): boolean {
  return /^(\+62|62|0)[0-9]{9,12}$/.test(phone);
}
```

---

## 📡 API Endpoints Reference

### Service Users

```typescript
// GET /service_users
// Fetch all service users
const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('service_users')
    .select('*, documents(*)')
    .order('created_at', { ascending: false });
  
  return data;
};

// POST /service_users
// Create new service user
const createUser = async (user: NewServiceUser) => {
  const { data, error } = await supabase
    .from('service_users')
    .insert([user])
    .select()
    .single();
  
  return data;
};

// PATCH /service_users/:id
// Update service user status
const updateStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('service_users')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  return data;
};

// DELETE /service_users/:id
// Delete service user
const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('service_users')
    .delete()
    .eq('id', id);
};
```

### Documents

```typescript
// POST /storage/documents
// Upload document
const uploadDocument = async (file: File, path: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(path, file);
  
  return data;
};

// GET /storage/documents/:path
// Get document URL
const getDocumentUrl = (path: string) => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

// DELETE /storage/documents/:path
// Delete document
const deleteDocument = async (path: string) => {
  const { error } = await supabase.storage
    .from('documents')
    .remove([path]);
};
```

### Notifications

```typescript
// GET /notifications
// Fetch user notifications
const fetchNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  return data;
};

// PATCH /notifications/:id
// Mark notification as read
const markAsRead = async (id: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id);
};

// DELETE /notifications
// Clear all notifications
const clearNotifications = async () => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.id);
};
```

---

## 🔧 Helper Functions

```typescript
// Convert data URL to File
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// Format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Compress image
async function compressImage(file: File, maxWidth: number = 1280): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
```

---

## 🧪 Testing

### Unit Tests Example

```typescript
// Test OCR extraction
describe('OCR Data Extraction', () => {
  it('should extract NIK from text', () => {
    const text = 'NIK: 3174012508900001';
    const result = extractDataFromText(text);
    expect(result.nik).toBe('3174012508900001');
  });
  
  it('should extract date from text', () => {
    const text = 'Tanggal Lahir: 25-08-1990';
    const result = extractDataFromText(text);
    expect(result.tanggalLahir).toBe('25-08-1990');
  });
});

// Test validation
describe('Input Validation', () => {
  it('should validate NIK', () => {
    expect(validateNIK('3174012508900001')).toBe(true);
    expect(validateNIK('12345')).toBe(false);
  });
  
  it('should validate email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

---

## 📊 Performance Optimization

### Code Splitting
```typescript
// Lazy load pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DataCollectionForm = lazy(() => import('./pages/DataCollectionForm'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/form" element={<DataCollectionForm />} />
  </Routes>
</Suspense>
```

### Memoization
```typescript
// Memoize expensive calculations
const filteredUsers = useMemo(() => {
  return serviceUsers.filter(user => 
    user.status === selectedStatus &&
    user.nama.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [serviceUsers, selectedStatus, searchQuery]);

// Memoize callbacks
const handleStatusUpdate = useCallback((userId: string, status: string) => {
  updateUserStatus(userId, status);
}, [updateUserStatus]);
```

### Virtual Scrolling (for large lists)
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: serviceUsers.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 100,
});
```

---

## 📝 Changelog & Version Control

### Version 1.0.0 (Current)
- ✅ OCR dengan Tesseract.js
- ✅ Webcam integration
- ✅ Multi-step form
- ✅ localStorage persistence
- ✅ Real-time notifications
- ✅ Responsive design
- ✅ Role-based dashboards

### Roadmap v2.0.0
- [ ] Supabase backend integration
- [ ] Real-time sync across devices
- [ ] Advanced OCR with ML models
- [ ] Batch document processing
- [ ] Export to PDF/Excel
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync

---

**Terakhir diupdate**: Maret 2026  
**Version**: 1.0.0  
**Maintainer**: Development Team
