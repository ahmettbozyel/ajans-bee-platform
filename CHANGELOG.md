# CHANGELOG

## v2.0.0 - 31 Aralık 2024

### 🎨 UI/UX Refactoring (9+ Puan Hedefi)

#### ✅ Light Mode Kaldırıldı
- `html` tag'ından `dark` class kaldırıldı (artık gerekli değil)
- Tüm `dark:` Tailwind prefix'leri temizlendi
- `html:not(.dark)` CSS kuralları silindi
- Theme toggle kaldırıldı (sadece dark mode)

#### ✅ CSS Design System Sadeleştirildi
- `globals.css` yeniden yazıldı (~200 satır azaltıldı)
- Yeni utility class'lar eklendi:
  - `glass-card`, `glass-subtle`
  - `bg-body`, `bg-sidebar`, `bg-topnav`, `bg-content`
  - `glow-{color}` (8 varyant)
  - `icon-box`, `icon-box-{color}` (8 varyant)
  - `menu-item`, `menu-active`
  - `input-dark`
  - `btn-primary`, `btn-secondary`, `btn-danger`
  - `progress-bar`, `progress-{color}`
  - `badge`, `badge-{color}`
  - `user-card`, `logo-container`
  - `section-divider`

#### ✅ Component Library Genişletildi
- `Button` - Yeni variant'lar: `success`, `ai`, düzeltilmiş stiller
- `Card` - Variant + glow + hoverable props eklendi
- `Input` - Dark mode optimized
- `Textarea` - Dark mode optimized
- `Label` - Dark mode optimized
- `EmptyState` - Yeni component
- `StatCard` - Yeni component

#### ✅ Layout Refactoring
- Dashboard layout inline styles → CSS classes
- Sidebar component ayrıştırıldı
- Mobile hamburger menu eklendi
- Mobile bottom navigation eklendi
- Responsive breakpoints düzenlendi

#### ✅ Dokümantasyon
- `/docs/UI-KIT.md` oluşturuldu - kapsamlı UI rehberi
- `/docs/ai-rules.md` güncellendi - light mode uyarısı eklendi

### 📁 Değişen Dosyalar
```
src/app/globals.css              - Yeniden yazıldı
src/app/layout.tsx               - Sadeleştirildi
src/app/(dashboard)/layout.tsx   - Yeniden yazıldı (mobile nav eklendi)
src/app/(dashboard)/dashboard/page.tsx - Refactored
src/app/(dashboard)/musteriler/page.tsx - dark: prefix temizlendi
src/app/(auth)/login/page.tsx    - Refactored
src/components/ui/button.tsx     - Yeni variants
src/components/ui/card.tsx       - Yeni variants
src/components/ui/input.tsx      - Dark mode optimized
src/components/ui/textarea.tsx   - Dark mode optimized
src/components/ui/label.tsx      - Dark mode optimized
src/components/ui/empty-state.tsx - YENİ
src/components/ui/stat-card.tsx  - YENİ
docs/UI-KIT.md                   - YENİ
docs/ai-rules.md                 - Güncellendi
```

### ⚠️ Breaking Changes
- Light mode artık desteklenmiyor
- `dark:` prefix kullanılan custom kodlar güncellenmeli
- Theme toggle kaldırıldı

### 🔜 Sonraki Adımlar
1. Diğer sayfalardaki `dark:` prefix'leri temizle
2. Customer detail sayfasını refactor et
3. Accessibility audit (focus states, aria labels)
4. Performance optimization (useMemo, lazy loading)

---

## v1.x - Önceki Sürümler
Detaylar için git history'ye bakın.
