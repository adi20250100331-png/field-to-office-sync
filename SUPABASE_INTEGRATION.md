# 🔗 Supabase Integration Guide

Panduan lengkap untuk mengintegrasikan aplikasi dengan Supabase backend.

---

## 📋 Daftar Isi

1. [Setup Supabase Project](#setup-supabase-project)
2. [Database Configuration](#database-configuration)
3. [Storage Setup](#storage-setup)
4. [Authentication](#authentication)
5. [Frontend Integration](#frontend-integration)
6. [Real-time Features](#real-time-features)
7. [Testing](#testing)

---

## 🚀 Setup Supabase Project

### 1. Buat Supabase Account

1. Kunjungi [supabase.com](https://supabase.com)
2. Sign up dengan GitHub/Email
3. Klik "New Project"
4. Isi form:
   - **Name**: Field-to-Office Sync
   - **Database Password**: [strong password]
   - **Region**: Southeast Asia (Singapore) - untuk Indonesia
   - **Pricing Plan**: Free tier (cukup untuk development)

### 2. Dapatkan API Credentials

1. Buka project dashboard
2. Klik **Settings** > **API**
3. Copy credentials:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...`

### 3. Setup Environment Variables

Buat file `.env` di root project:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🗄️ Database Configuration

### 1. Jalankan Database Migration

1. Buka **SQL Editor** di Supabase Dashboard
2. Copy isi file `supabase-setup.sql`
3. Paste dan **Run**
4. Tunggu sampai selesai (~30 detik)
5. Verify tables dibuat dengan query:

```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Expected output:
- ✅ user_profiles
- ✅ service_users
- ✅ documents
- ✅ notifications
- ✅ activity_logs

### 2. Verify Row Level Security (RLS)

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Semua table harus `rowsecurity = true`

### 3. Test Policies

```sql
-- Test sebagai authenticated user
SET request.jwt.claim.sub = 'user-uuid-here';

-- Test query
SELECT * FROM service_users;
```

---

## 📦 Storage Setup

### 1. Create Storage Bucket

Sudah dibuat otomatis via SQL script, tapi bisa juga manual:

1. Buka **Storage** di Supabase Dashboard
2. Klik **New Bucket**
3. Name: `documents`
4. Public: ✅ **Yes**
5. File size limit: 10MB

### 2. Configure Storage Policies

Policies sudah dibuat via SQL, verify:

1. Klik bucket **documents**
2. Tab **Policies**
3. Cek policies:
   - ✅ Authenticated users can upload
   - ✅ Anyone can view
   - ✅ Users can delete own files
   - ✅ Admins can delete any files

### 3. Test Upload

```typescript
const testUpload = async () => {
  const file = new File(['test'], 'test.txt');
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload('test/test.txt', file);
  
  console.log('Upload result:', data, error);
};
```

---

## 🔐 Authentication

### 1. Enable Email Provider

1. **Authentication** > **Providers**
2. Enable **Email**
3. Configure:
   - ✅ Confirm email: Optional (development)
   - ✅ Secure email change: Yes
   - Minimum password length: 8

### 2. Create Test Users

#### Via Supabase Dashboard:
1. **Authentication** > **Users**
2. **Add User**
3. Isi:
   - Email: `admin@test.com`
   - Password: `TestAdmin123`
   - Auto confirm: ✅ Yes

#### Via SQL:
```sql
-- Insert test admin
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  uuid_generate_v4(),
  'authenticated',
  'authenticated',
  'admin@test.com',
  crypt('TestAdmin123', gen_salt('bf')),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);

-- Create user profile
INSERT INTO user_profiles (id, full_name, role, phone)
SELECT 
  id,
  'Admin User',
  'admin',
  '+6281234567890'
FROM auth.users 
WHERE email = 'admin@test.com';
```

### 3. Test Authentication

```typescript
// Test login
const testLogin = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'admin@test.com',
    password: 'TestAdmin123'
  });
  
  console.log('Login result:', data, error);
};

// Test session
const checkSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Current session:', session);
};
```

---

## 💻 Frontend Integration

### 1. Install Supabase Client

```bash
pnpm add @supabase/supabase-js
```

### 2. Create Supabase Client

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
```

### 3. Create Auth Context

**File**: `src/app/context/AuthContext.tsx`

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 4. Update App.tsx

```typescript
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <RouterProvider router={router} />
      </DataProvider>
    </AuthProvider>
  );
}
```

### 5. Create Login Page

**File**: `src/app/pages/LoginPage.tsx`

```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast.success('Login berhasil!');
      navigate('/');
    } catch (error: any) {
      toast.error('Login gagal', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5F7] to-white">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

### 6. Update DataContext dengan Supabase

**File**: `src/app/context/DataContext.tsx`

```typescript
import { supabase } from '../../lib/supabase';

// Add service user dengan upload to Supabase
const addServiceUser = async (user: Omit<ServiceUser, 'id' | 'createdAt'>) => {
  try {
    // 1. Upload documents to storage
    const uploadedDocs = await Promise.all(
      user.documents.map(async (doc) => {
        // Convert base64 to file
        const file = dataURLtoFile(doc.imageUrl, `${doc.id}.jpg`);
        
        // Upload to Supabase Storage
        const filePath = `${user.nik}/${doc.id}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath);
        
        return {
          ...doc,
          imageUrl: urlData.publicUrl,
          storage_path: filePath
        };
      })
    );
    
    // 2. Insert user data
    const { data: userData, error: userError } = await supabase
      .from('service_users')
      .insert([{
        nama: user.nama,
        nik: user.nik,
        alamat: user.alamat,
        no_telepon: user.noTelepon,
        email: user.email,
        jenis_layanan: user.jenisLayanan,
        keterangan: user.keterangan,
        status: user.status,
        field_officer_id: (await supabase.auth.getUser()).data.user?.id,
        field_officer_name: (await supabase.auth.getUser()).data.user?.email
      }])
      .select()
      .single();
    
    if (userError) throw userError;
    
    // 3. Insert documents
    await Promise.all(
      uploadedDocs.map(doc => 
        supabase.from('documents').insert({
          service_user_id: userData.id,
          type: doc.type,
          image_url: doc.imageUrl,
          storage_path: doc.storage_path,
          ocr_text: doc.ocrText,
          ocr_data: doc.ocrData
        })
      )
    );
    
    // 4. Update local state
    setServiceUsers(prev => [...prev, userData]);
    
    toast.success('Data berhasil dikirim!');
  } catch (error: any) {
    console.error('Error adding service user:', error);
    toast.error('Gagal mengirim data', {
      description: error.message
    });
  }
};

// Helper function
function dataURLtoFile(dataurl: string, filename: string): File {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
```

---

## 🔔 Real-time Features

### 1. Subscribe to New Submissions

```typescript
useEffect(() => {
  // Subscribe to new service users
  const channel = supabase
    .channel('service_users_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'service_users'
      },
      (payload) => {
        console.log('New submission:', payload);
        setServiceUsers(prev => [payload.new, ...prev]);
        toast.info('Pengajuan baru masuk!');
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### 2. Subscribe to Status Changes

```typescript
useEffect(() => {
  const channel = supabase
    .channel('status_changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'service_users',
        filter: `field_officer_id=eq.${user?.id}`
      },
      (payload) => {
        console.log('Status changed:', payload);
        
        // Update local state
        setServiceUsers(prev =>
          prev.map(u => u.id === payload.new.id ? payload.new : u)
        );
        
        // Show notification
        toast.info('Status updated', {
          description: `${payload.new.nama} - ${payload.new.status}`
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);
```

### 3. Subscribe to Notifications

```typescript
useEffect(() => {
  const channel = supabase
    .channel('notifications')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user?.id}`
      },
      (payload) => {
        setNotifications(prev => [payload.new, ...prev]);
        
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('Field-to-Office Sync', {
            body: payload.new.message,
            icon: '/logo.png'
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user]);
```

---

## 🧪 Testing

### 1. Test Database Queries

```typescript
// Test fetch all users
const testFetch = async () => {
  const { data, error } = await supabase
    .from('service_users')
    .select('*, documents(*)')
    .order('created_at', { ascending: false });
  
  console.log('Fetch result:', data, error);
};

// Test insert
const testInsert = async () => {
  const { data, error } = await supabase
    .from('service_users')
    .insert({
      nama: 'Test User',
      nik: '1234567890123456',
      alamat: 'Test Address',
      jenis_layanan: 'Test Service'
    })
    .select()
    .single();
  
  console.log('Insert result:', data, error);
};

// Test update
const testUpdate = async (id: string) => {
  const { data, error } = await supabase
    .from('service_users')
    .update({ status: 'verified' })
    .eq('id', id)
    .select()
    .single();
  
  console.log('Update result:', data, error);
};
```

### 2. Test Storage

```typescript
// Test upload
const testUpload = async () => {
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(`test/${Date.now()}.txt`, file);
  
  console.log('Upload result:', data, error);
};

// Test download
const testDownload = async (path: string) => {
  const { data, error } = await supabase.storage
    .from('documents')
    .download(path);
  
  console.log('Download result:', data, error);
};
```

### 3. Test Real-time

```typescript
const testRealtime = () => {
  const channel = supabase
    .channel('test-channel')
    .on('broadcast', { event: 'test' }, (payload) => {
      console.log('Received:', payload);
    })
    .subscribe();
  
  // Send test message
  setTimeout(() => {
    channel.send({
      type: 'broadcast',
      event: 'test',
      payload: { message: 'Hello!' }
    });
  }, 1000);
};
```

---

## 🔍 Monitoring & Debugging

### 1. Enable Supabase Logs

Dashboard > **Logs** > Select log type:
- API Logs
- Database Logs
- Storage Logs
- Real-time Logs

### 2. Check Query Performance

```sql
-- Enable query timing
EXPLAIN ANALYZE
SELECT * FROM service_users WHERE status = 'pending';
```

### 3. Monitor Storage Usage

Dashboard > **Storage** > Usage stats

---

## 📊 Production Checklist

Before going to production:

- [ ] Enable email confirmation
- [ ] Configure custom SMTP (optional)
- [ ] Setup custom domain
- [ ] Enable rate limiting
- [ ] Configure CORS policies
- [ ] Setup backup schedule
- [ ] Enable audit logs
- [ ] Configure monitoring alerts
- [ ] Test all RLS policies
- [ ] Load test with realistic data
- [ ] Setup staging environment
- [ ] Document API endpoints

---

## 🆘 Common Issues

### Issue: "Failed to fetch"

**Cause**: CORS or network issue

**Solution**:
```typescript
// Add to supabase client config
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'x-my-custom-header': 'my-value',
    },
  },
});
```

### Issue: "Row level security violated"

**Cause**: User doesn't have permission

**Solution**:
1. Check RLS policies in database
2. Verify user role
3. Test with service_role key (development only)

### Issue: "Storage object not found"

**Cause**: File path incorrect or deleted

**Solution**:
```typescript
// Always check if file exists first
const { data: exists } = await supabase.storage
  .from('documents')
  .list('folder');

console.log('Files:', exists);
```

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Real-time Guide](https://supabase.com/docs/guides/realtime)

---

**Integration Complete! 🎉**

Aplikasi sekarang fully integrated dengan Supabase backend.
