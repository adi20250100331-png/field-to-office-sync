-- ====================================================
-- SUPABASE DATABASE SETUP
-- Field-to-Office Sync Application
-- ====================================================
-- 
-- Jalankan script ini di Supabase SQL Editor
-- untuk membuat semua tables, policies, dan storage buckets
-- 
-- ====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================
-- 1. USER PROFILES TABLE
-- ====================================================

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(255),
  role VARCHAR(20) DEFAULT 'field_officer' CHECK (role IN ('field_officer', 'admin')),
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ====================================================
-- 2. SERVICE USERS TABLE
-- ====================================================

CREATE TABLE service_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  nik VARCHAR(16) NOT NULL,
  alamat TEXT NOT NULL,
  no_telepon VARCHAR(20),
  email VARCHAR(255),
  jenis_layanan VARCHAR(255) NOT NULL,
  keterangan TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'incomplete')),
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
CREATE INDEX idx_service_users_nik ON service_users(nik);

-- Full text search index
CREATE INDEX idx_service_users_search ON service_users USING gin(to_tsvector('indonesian', nama || ' ' || nik || ' ' || alamat));

-- Row Level Security
ALTER TABLE service_users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Field officers can insert their own data"
  ON service_users FOR INSERT
  WITH CHECK (auth.uid() = field_officer_id);

CREATE POLICY "Field officers can view their own data"
  ON service_users FOR SELECT
  USING (auth.uid() = field_officer_id);

CREATE POLICY "Admins can view all data"
  ON service_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all data"
  ON service_users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete data"
  ON service_users FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ====================================================
-- 3. DOCUMENTS TABLE
-- ====================================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_user_id UUID REFERENCES service_users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('KTP', 'KK', 'NPWP', 'OTHER')),
  image_url TEXT NOT NULL,
  storage_path TEXT,
  ocr_text TEXT,
  ocr_data JSONB,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_service_user ON documents(service_user_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- GIN index for JSONB ocr_data
CREATE INDEX idx_documents_ocr_data ON documents USING gin(ocr_data);

-- Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM service_users 
      WHERE id = service_user_id 
      AND (field_officer_id = auth.uid() OR 
           EXISTS (
             SELECT 1 FROM user_profiles 
             WHERE user_profiles.id = auth.uid() 
             AND user_profiles.role = 'admin'
           ))
    )
  );

CREATE POLICY "Field officers can insert documents for their users"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM service_users
      WHERE id = service_user_id
      AND field_officer_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own documents"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM service_users
      WHERE id = service_user_id
      AND field_officer_id = auth.uid()
    )
  );

CREATE POLICY "Admins can delete any documents"
  ON documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ====================================================
-- 4. NOTIFICATIONS TABLE
-- ====================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  service_user_id UUID REFERENCES service_users(id) ON DELETE CASCADE,
  user_name VARCHAR(255),
  message TEXT NOT NULL,
  type VARCHAR(20) DEFAULT 'new' CHECK (type IN ('new', 'status-change', 'system')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- ====================================================
-- 5. ACTIVITY LOGS TABLE (Optional - untuk audit trail)
-- ====================================================

CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Row Level Security
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies (only admins can view logs)
CREATE POLICY "Admins can view all logs"
  ON activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ====================================================
-- 6. STORAGE BUCKETS
-- ====================================================

-- Create documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can view documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Users can update their documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can delete any documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents' AND
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ====================================================
-- 7. FUNCTIONS
-- ====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_users_updated_at
  BEFORE UPDATE ON service_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create notification on status change
CREATE OR REPLACE FUNCTION notify_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO notifications (user_id, service_user_id, user_name, message, type)
    VALUES (
      NEW.field_officer_id,
      NEW.id,
      NEW.nama,
      'Status pengajuan ' || NEW.nama || ' diubah menjadi ' || NEW.status,
      'status-change'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for status change notification
CREATE TRIGGER on_service_user_status_change
  AFTER UPDATE ON service_users
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION notify_status_change();

-- Function to create notification on new submission
CREATE OR REPLACE FUNCTION notify_new_submission()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all admins
  INSERT INTO notifications (user_id, service_user_id, user_name, message, type)
  SELECT 
    up.id,
    NEW.id,
    NEW.nama,
    'Pengajuan baru dari ' || NEW.nama || ' (' || NEW.jenis_layanan || ')',
    'new'
  FROM user_profiles up
  WHERE up.role = 'admin';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new submission notification
CREATE TRIGGER on_new_service_user
  AFTER INSERT ON service_users
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_submission();

-- Function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_action VARCHAR(100),
  p_entity_type VARCHAR(50),
  p_entity_id UUID,
  p_details JSONB DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details)
  VALUES (auth.uid(), p_action, p_entity_type, p_entity_id, p_details);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================================
-- 8. VIEWS (untuk simplified queries)
-- ====================================================

-- View for service users with document count
CREATE OR REPLACE VIEW service_users_with_stats AS
SELECT 
  su.*,
  COUNT(d.id) as document_count,
  up.full_name as field_officer_full_name,
  up.phone as field_officer_phone
FROM service_users su
LEFT JOIN documents d ON su.id = d.service_user_id
LEFT JOIN user_profiles up ON su.field_officer_id = up.id
GROUP BY su.id, up.full_name, up.phone;

-- View for unread notifications count
CREATE OR REPLACE VIEW notification_counts AS
SELECT 
  user_id,
  COUNT(*) FILTER (WHERE NOT read) as unread_count,
  COUNT(*) as total_count
FROM notifications
GROUP BY user_id;

-- ====================================================
-- 9. SEED DATA (Optional - untuk testing)
-- ====================================================

-- Uncomment untuk insert sample admin user
-- Note: Ganti dengan user ID yang sebenarnya dari auth.users

-- INSERT INTO user_profiles (id, full_name, role, phone)
-- VALUES 
--   ('your-user-uuid-here', 'Admin User', 'admin', '+6281234567890'),
--   ('another-user-uuid', 'Field Officer', 'field_officer', '+6281234567891');

-- ====================================================
-- 10. INDEXES untuk Performance
-- ====================================================

-- Composite indexes untuk common queries
CREATE INDEX idx_service_users_status_created 
  ON service_users(status, created_at DESC);

CREATE INDEX idx_documents_user_type 
  ON documents(service_user_id, type);

CREATE INDEX idx_notifications_user_unread 
  ON notifications(user_id, read, created_at DESC);

-- ====================================================
-- SETUP COMPLETE
-- ====================================================

-- Verify tables
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Database setup completed successfully!';
  RAISE NOTICE '📋 Tables created: user_profiles, service_users, documents, notifications, activity_logs';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '📦 Storage bucket "documents" created';
  RAISE NOTICE '🔔 Notification triggers configured';
  RAISE NOTICE '';
  RAISE NOTICE '⚠️  NEXT STEPS:';
  RAISE NOTICE '1. Update user_profiles with actual user IDs from auth.users';
  RAISE NOTICE '2. Configure authentication in your app';
  RAISE NOTICE '3. Test RLS policies with different roles';
  RAISE NOTICE '4. Update .env with Supabase credentials';
END $$;
