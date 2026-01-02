-- Users tablosuna profil alanları ekle
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS blood_type text CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', '0+', '0-'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS emergency_contact_phone text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS health_notes text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;

-- Indexler
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

COMMENT ON COLUMN users.phone IS 'Kullanıcı telefon numarası';
COMMENT ON COLUMN users.address IS 'Kullanıcı adresi';
COMMENT ON COLUMN users.blood_type IS 'Kan grubu (A+, A-, B+, B-, AB+, AB-, 0+, 0-)';
COMMENT ON COLUMN users.emergency_contact_name IS 'Acil durumda aranacak kişi';
COMMENT ON COLUMN users.emergency_contact_phone IS 'Acil durumda aranacak telefon';
COMMENT ON COLUMN users.health_notes IS 'Sağlık notları (alerji, kronik hastalık vs.)';
COMMENT ON COLUMN users.avatar_url IS 'Profil fotoğrafı URL';
