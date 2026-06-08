
-- Wilayas (48 Algerian states)
CREATE TABLE IF NOT EXISTS wilayas (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name_arabic TEXT NOT NULL,
  name_french TEXT NOT NULL,
  name_english TEXT NOT NULL
);

-- Baladiyas (municipalities)
CREATE TABLE IF NOT EXISTS baladiyas (
  id SERIAL PRIMARY KEY,
  wilaya_id INTEGER REFERENCES wilayas(id),
  name_arabic TEXT NOT NULL,
  name_french TEXT NOT NULL
);

-- Specialties
CREATE TABLE IF NOT EXISTS specialties (
  id SERIAL PRIMARY KEY,
  name_arabic TEXT NOT NULL,
  name_french TEXT NOT NULL,
  name_english TEXT NOT NULL
);

-- Doctors
CREATE TABLE IF NOT EXISTS doctors (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty_id INTEGER REFERENCES specialties(id),
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  fee NUMERIC(10,2),
  rating NUMERIC(3,2) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  reviews_distribution JSONB DEFAULT '{"1":0,"2":0,"3":0,"4":0,"5":0}',
  years_experience INTEGER DEFAULT 0,
  patients_count INTEGER DEFAULT 0,
  satisfaction_rate INTEGER DEFAULT 0,
  about TEXT,
  tags TEXT[],
  image_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (user profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  wilaya_id INTEGER REFERENCES wilayas(id),
  blood_type TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blood donors
CREATE TABLE IF NOT EXISTS blood_donors (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  blood_type TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  phone TEXT,
  is_available BOOLEAN DEFAULT true,
  hide_name BOOLEAN DEFAULT false,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pharmacies
CREATE TABLE IF NOT EXISTS pharmacies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  on_call_24h BOOLEAN DEFAULT false,
  night_shift BOOLEAN DEFAULT false,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'public',
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  services TEXT[],
  beds_count INTEGER,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctors(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  visit_type TEXT DEFAULT 'in_person',
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctors(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipment donors
CREATE TABLE IF NOT EXISTS equipment_donors (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  equipment_type TEXT NOT NULL,
  condition TEXT DEFAULT 'good',
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  phone TEXT,
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Civil protection
CREATE TABLE IF NOT EXISTS civil_protection (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7)
);

-- Herbal medicine
CREATE TABLE IF NOT EXISTS herbal_medicine (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  specialization TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7)
);

-- Mobility centers
CREATE TABLE IF NOT EXISTS mobility_centers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  services TEXT[],
  lat NUMERIC(10,7),
  lng NUMERIC(10,7)
);

-- Patient associations
CREATE TABLE IF NOT EXISTS patient_associations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  disease_type TEXT,
  wilaya_id INTEGER REFERENCES wilayas(id),
  phone TEXT,
  email TEXT
);

-- Addiction centers
CREATE TABLE IF NOT EXISTS addiction_centers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7)
);

-- Vet clinics
CREATE TABLE IF NOT EXISTS vet_clinics (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  wilaya_id INTEGER REFERENCES wilayas(id),
  baladiya_id INTEGER REFERENCES baladiyas(id),
  address TEXT,
  phone TEXT,
  lat NUMERIC(10,7),
  lng NUMERIC(10,7)
);

-- Pending submissions
CREATE TABLE IF NOT EXISTS pending_submissions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  submission_type TEXT NOT NULL,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_submissions ENABLE ROW LEVEL SECURITY;

-- Public read-only tables (no RLS needed for SELECT by all)
ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;
ALTER TABLE baladiyas ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE civil_protection ENABLE ROW LEVEL SECURITY;
ALTER TABLE herbal_medicine ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_clinics ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_wilayas" ON wilayas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_baladiyas" ON baladiyas FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_specialties" ON specialties FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_doctors" ON doctors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_pharmacies" ON pharmacies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_hospitals" ON hospitals FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_civil" ON civil_protection FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_herbal" ON herbal_medicine FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_vet" ON vet_clinics FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_blood_donors" ON blood_donors FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "public_read_equipment" ON equipment_donors FOR SELECT TO anon, authenticated USING (true);

-- Profiles policies
CREATE POLICY "select_own_profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE TO authenticated USING (auth.uid() = id);

-- Appointments policies
CREATE POLICY "select_own_appointments" ON appointments FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_appointments" ON appointments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_appointments" ON appointments FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_appointments" ON appointments FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "select_reviews" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "insert_own_review" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_review" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_review" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Blood donors policies
CREATE POLICY "insert_own_donor" ON blood_donors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_donor" ON blood_donors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_donor" ON blood_donors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Equipment donors policies
CREATE POLICY "insert_own_equipment" ON equipment_donors FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_equipment" ON equipment_donors FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_equipment" ON equipment_donors FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Pending submissions policies
CREATE POLICY "select_own_submissions" ON pending_submissions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_submission" ON pending_submissions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_submission" ON pending_submissions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_submission" ON pending_submissions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
