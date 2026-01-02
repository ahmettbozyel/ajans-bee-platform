-- customers tablosu için RLS politikası
-- Authenticated kullanıcılar okuyabilir

-- RLS'in etkin olduğundan emin ol
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Tüm authenticated kullanıcılar müşterileri okuyabilir
CREATE POLICY "Authenticated users can read customers"
ON customers
FOR SELECT
TO authenticated
USING (true);

-- Sadece admin ve yönetici insert yapabilir
CREATE POLICY "Admins can insert customers"
ON customers
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'yonetici')
  )
);

-- Sadece admin ve yönetici update yapabilir
CREATE POLICY "Admins can update customers"
ON customers
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'yonetici')
  )
);

-- Sadece admin delete yapabilir
CREATE POLICY "Only admins can delete customers"
ON customers
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);
