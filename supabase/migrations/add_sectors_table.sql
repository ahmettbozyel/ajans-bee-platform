-- Sectors tablosu - Marka sektörlerini yönetmek için
CREATE TABLE IF NOT EXISTS sectors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Sectors are viewable by everyone" ON sectors
  FOR SELECT USING (true);

-- Sadece admin/yönetici ekleyebilir/düzenleyebilir
CREATE POLICY "Sectors are editable by admins" ON sectors
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('admin', 'yonetici')
    )
  );

-- Mevcut sektörleri aktar (customer-types.ts'den)
INSERT INTO sectors (name, slug, sort_order) VALUES
  -- Perakende & Ticaret
  ('E-Ticaret', 'e-ticaret', 1),
  ('Perakende', 'perakende', 2),
  ('Toptan Ticaret', 'toptan', 3),

  -- Gıda & İçecek
  ('Gıda & İçecek', 'gida', 4),
  ('Restoran & Kafe', 'restoran', 5),
  ('Catering & Organizasyon', 'catering', 6),

  -- Moda & Güzellik
  ('Tekstil & Moda', 'tekstil', 7),
  ('Kozmetik & Güzellik', 'kozmetik', 8),
  ('Kuyumculuk & Aksesuar', 'kuyumculuk', 9),
  ('Ayakkabı & Çanta', 'ayakkabi', 10),

  -- Sağlık
  ('Sağlık & Medikal', 'saglik', 11),
  ('Eczane', 'eczane', 12),
  ('Diş Hekimliği', 'dis', 13),
  ('Estetik & Plastik Cerrahi', 'estetik', 14),
  ('Psikoloji & Terapi', 'psikoloji', 15),
  ('Veterinerlik', 'veteriner', 16),
  ('Spor & Fitness', 'spor-fitness', 17),

  -- Teknoloji & Yazılım
  ('Teknoloji', 'teknoloji', 18),
  ('Yazılım & SaaS', 'yazilim', 19),
  ('Dijital Ajans', 'ajans', 20),
  ('IT Danışmanlık', 'danismanlik-it', 21),

  -- Eğitim
  ('Eğitim', 'egitim', 22),
  ('Kurs & Eğitim Merkezi', 'kurs', 23),
  ('Üniversite & Okul', 'universite', 24),
  ('Çocuk Eğitimi', 'cocuk', 25),

  -- Finans & Hukuk
  ('Finans & Bankacılık', 'finans', 26),
  ('Sigorta', 'sigorta', 27),
  ('Muhasebe & Mali Müşavirlik', 'muhasebe', 28),
  ('Hukuk & Avukatlık', 'hukuk', 29),

  -- Gayrimenkul & İnşaat
  ('Gayrimenkul', 'gayrimenkul', 30),
  ('İnşaat', 'insaat', 31),
  ('Mimarlık & İç Tasarım', 'mimarlik', 32),
  ('Dekorasyon & Mobilya', 'dekorasyon', 33),

  -- Turizm & Konaklama
  ('Turizm & Seyahat', 'turizm', 34),
  ('Otel & Konaklama', 'otel', 35),
  ('Transfer & Araç Kiralama', 'transfer', 36),

  -- Otomotiv & Ulaşım
  ('Otomotiv', 'otomotiv', 37),
  ('Oto Servis & Yedek Parça', 'oto-servis', 38),
  ('Lojistik & Kargo', 'lojistik', 39),

  -- Enerji & Çevre
  ('Enerji', 'enerji', 40),
  ('Yenilenebilir Enerji', 'yenilenebilir', 41),
  ('Çevre & Geri Dönüşüm', 'cevre', 42),

  -- Üretim & Sanayi
  ('Üretim & Sanayi', 'uretim', 43),
  ('Makine & Ekipman', 'makine', 44),
  ('Kimya & Plastik', 'kimya', 45),
  ('Ambalaj', 'ambalaj', 46),

  -- Tarım & Hayvancılık
  ('Tarım', 'tarim', 47),
  ('Hayvancılık', 'hayvancilik', 48),
  ('Organik Ürünler', 'organik', 49),

  -- Medya & Eğlence
  ('Medya & Yayıncılık', 'medya', 50),
  ('Eğlence & Etkinlik', 'eglence', 51),
  ('Müzik & Sanat', 'muzik', 52),
  ('Oyun & E-Spor', 'oyun', 53),

  -- Hizmet
  ('Danışmanlık', 'danismanlik', 54),
  ('Temizlik Hizmetleri', 'temizlik', 55),
  ('Güvenlik', 'guvenlik', 56),
  ('İnsan Kaynakları', 'hr', 57),
  ('Fotoğraf & Video', 'fotograf', 58),

  -- STK & Kamu
  ('STK & Vakıf', 'stk', 59),
  ('Kamu & Belediye', 'kamu', 60),

  -- Diğer
  ('Diğer', 'diger', 99)
ON CONFLICT (slug) DO NOTHING;

-- Index
CREATE INDEX IF NOT EXISTS idx_sectors_sort_order ON sectors(sort_order);
CREATE INDEX IF NOT EXISTS idx_sectors_is_active ON sectors(is_active);

COMMENT ON TABLE sectors IS 'Marka sektörleri - Ayarlar sayfasından yönetilir';
COMMENT ON COLUMN sectors.name IS 'Sektör adı (görüntülenecek)';
COMMENT ON COLUMN sectors.slug IS 'Sektör kodu (URL ve DB için)';
COMMENT ON COLUMN sectors.sort_order IS 'Sıralama değeri';
COMMENT ON COLUMN sectors.is_active IS 'Aktif/Pasif durumu';
