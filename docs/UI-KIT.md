# 🎨 AJANS BEE - UI KIT v2.1

**Tarih:** 31 Aralık 2024
**Amaç:** Claude Code/Desktop bu dosyayı okuyarak tutarlı UI üretir
**Kural:** Light mode YOK, sadece dark mode

---

## 🎯 TEMEL PRENSİPLER

1. **Dark-only** - Light mode desteği yok, `dark:` prefix KULLANMA
2. **Glass morphism** - Yarı saydam, blur efektli kartlar
3. **Glow borders** - Renkli ışıltılı kenarlıklar
4. **Full-width** - Content alanı tam genişlik kullanır
5. **Tutarlı** - Her yerde aynı spacing, radius, renkler

---

## 🎨 RENK PALETİ

### Ana Renkler
```css
/* Background */
--bg-body: #09090b;           /* zinc-950 - sayfa arkaplanı */
--bg-card: rgba(255,255,255,0.03);  /* glass kartlar */
--bg-elevated: #18181b;       /* zinc-900 - modal, dropdown */
--bg-input: rgba(255,255,255,0.05); /* input arka plan */

/* Text */
--text-primary: #ffffff;      /* beyaz - başlıklar */
--text-secondary: #a1a1aa;    /* zinc-400 - açıklamalar */
--text-muted: #71717a;        /* zinc-500 - placeholder */
--text-label: #d4d4d8;        /* zinc-300 - form label */

/* Border */
--border-subtle: rgba(255,255,255,0.06);
--border-default: rgba(255,255,255,0.1);
--border-strong: rgba(255,255,255,0.2);
--border-focus: rgba(99,102,241,0.5);
```

### Accent Renkler
| İsim | HEX | Kullanım |
|------|-----|----------|
| Indigo | #6366f1 | Primary, aktif state, focus |
| Violet | #8b5cf6 | Secondary, hover |
| Cyan | #22d3ee | Info, link |
| Emerald | #10b981 | Success, online |
| Amber | #f59e0b | Warning, pending |
| Rose | #f43f5e | Error, danger |
| Fuchsia | #d946ef | AI, special |
| Bee Yellow | #FFD600 | Logo, premium |

---

## 📐 SPACING & SIZING

### Spacing Scale
```
4px   → gap-1, p-1, m-1
8px   → gap-2, p-2, m-2
12px  → gap-3, p-3, m-3
16px  → gap-4, p-4, m-4
20px  → gap-5, p-5, m-5  ⭐ (card padding)
24px  → gap-6, p-6, m-6  ⭐ (section gap)
32px  → gap-8, p-8, m-8
```

### Border Radius
```
rounded-lg   → 8px  (small elements)
rounded-xl   → 12px ⭐ (input, button, card içi)
rounded-2xl  → 16px ⭐ (kartlar, modal)
rounded-full → pill (badge, avatar)
```

### Layout Dimensions
```
Sidebar width: 256px (w-64)
Content: full-width (no max-width)
Card padding: 20px (p-5)
Section gap: 24px (space-y-6)
Form gap: 16px (space-y-4)
```

---

## 📝 FORM ELEMANLARI

### Input (Temel)
```tsx
<input 
  className="w-full h-11 px-4 rounded-xl text-sm text-white
    bg-white/5 border border-white/10
    placeholder:text-zinc-500
    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
    transition-all"
  placeholder="Placeholder..."
/>
```

**Veya component kullan:**
```tsx
<Input placeholder="Placeholder..." />
```

### Input with Icon
```tsx
<div className="relative">
  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
  <Input className="pl-11" placeholder="Ara..." />
</div>
```

### Textarea
```tsx
<textarea 
  className="w-full min-h-[120px] px-4 py-3 rounded-xl text-sm text-white
    bg-white/5 border border-white/10
    placeholder:text-zinc-500
    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
    resize-none transition-all"
  placeholder="Açıklama..."
/>
```

### Label
```tsx
<label className="block text-sm font-medium text-zinc-300 mb-2">
  Label Text
  <span className="text-rose-400 ml-1">*</span> {/* Zorunlu ise */}
</label>
```

### Select / Dropdown
```tsx
<select 
  className="w-full h-11 px-4 rounded-xl text-sm text-white appearance-none cursor-pointer
    bg-white/5 border border-white/10
    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
    transition-all"
>
  <option value="">Seçin...</option>
  <option value="1">Seçenek 1</option>
</select>

{/* Select icon için wrapper */}
<div className="relative">
  <select className="...">...</select>
  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
</div>
```

### Checkbox
```tsx
<label className="flex items-center gap-3 cursor-pointer group">
  <div className="relative">
    <input type="checkbox" className="peer sr-only" />
    <div className="w-5 h-5 rounded-md border border-white/20 bg-white/5
      peer-checked:bg-indigo-500 peer-checked:border-indigo-500
      peer-focus:ring-2 peer-focus:ring-indigo-500/20
      transition-all" />
    <Check className="absolute inset-0 m-auto w-3 h-3 text-white opacity-0 peer-checked:opacity-100" />
  </div>
  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
    Checkbox label
  </span>
</label>
```

### Radio Button
```tsx
<label className="flex items-center gap-3 cursor-pointer group">
  <div className="relative">
    <input type="radio" name="group" className="peer sr-only" />
    <div className="w-5 h-5 rounded-full border border-white/20 bg-white/5
      peer-checked:border-indigo-500
      peer-focus:ring-2 peer-focus:ring-indigo-500/20
      transition-all" />
    <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-indigo-500 
      opacity-0 peer-checked:opacity-100 transition-all" />
  </div>
  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
    Radio label
  </span>
</label>
```

### Switch / Toggle
```tsx
<label className="flex items-center gap-3 cursor-pointer">
  <div className="relative">
    <input type="checkbox" className="peer sr-only" />
    <div className="w-11 h-6 rounded-full bg-white/10 border border-white/10
      peer-checked:bg-indigo-500 peer-checked:border-indigo-500
      transition-all" />
    <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white
      peer-checked:translate-x-5 transition-all" />
  </div>
  <span className="text-sm text-zinc-300">Toggle label</span>
</label>
```

### Form Group
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-zinc-300">
    Field Label <span className="text-rose-400">*</span>
  </label>
  <Input placeholder="Enter value..." />
  <p className="text-xs text-zinc-500">Helper text goes here</p>
</div>
```

### Form Error State
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-zinc-300">Email</label>
  <Input 
    className="border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20" 
    placeholder="email@example.com" 
  />
  <p className="text-xs text-rose-400 flex items-center gap-1">
    <AlertCircle className="w-3 h-3" />
    Geçerli bir email adresi girin
  </p>
</div>
```

### Button Group (Selection)
```tsx
<div className="grid grid-cols-2 gap-3">
  <button
    type="button"
    className={`p-4 rounded-xl border-2 transition-all text-center ${
      selected === 'option1'
        ? 'border-indigo-500 bg-indigo-500/10'
        : 'border-white/10 hover:border-white/20'
    }`}
  >
    <span className="text-2xl mb-2 block">🏢</span>
    <span className={`text-sm font-medium ${
      selected === 'option1' ? 'text-indigo-400' : 'text-zinc-300'
    }`}>Option 1</span>
  </button>
  {/* Option 2... */}
</div>
```

### Date Input
```tsx
<input 
  type="date"
  className="w-full h-11 px-4 rounded-xl text-sm text-white
    bg-white/5 border border-white/10
    focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20
    [color-scheme:dark] transition-all"
/>
```

---

## 🔘 BUTTON VARİANTLARI

### Primary (Gradient)
```tsx
<button className="h-11 px-5 rounded-xl text-white text-sm font-medium
  bg-gradient-to-r from-indigo-600 to-violet-600
  shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
  active:scale-[0.98] transition-all">
  Primary Button
</button>
```

### Secondary (Outline)
```tsx
<button className="h-11 px-5 rounded-xl text-sm font-medium
  bg-white/5 border border-white/10 text-zinc-300
  hover:bg-white/10 hover:text-white
  active:scale-[0.98] transition-all">
  Secondary
</button>
```

### Ghost (Transparent)
```tsx
<button className="h-11 px-5 rounded-xl text-sm font-medium
  text-zinc-400 hover:bg-white/10 hover:text-white
  active:scale-[0.98] transition-all">
  Ghost
</button>
```

### Danger
```tsx
<button className="h-11 px-5 rounded-xl text-sm font-medium
  bg-rose-500/10 border border-rose-500/20 text-rose-400
  hover:bg-rose-500/20
  active:scale-[0.98] transition-all">
  Delete
</button>
```

### Success
```tsx
<button className="h-11 px-5 rounded-xl text-white text-sm font-medium
  bg-gradient-to-r from-emerald-600 to-teal-600
  shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40
  active:scale-[0.98] transition-all">
  Success
</button>
```

### AI Button
```tsx
<button className="h-11 px-5 rounded-xl text-white text-sm font-medium
  bg-gradient-to-r from-fuchsia-600 to-violet-600
  shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40
  active:scale-[0.98] transition-all">
  <Sparkles className="w-4 h-4 mr-2" />
  AI Generate
</button>
```

### Icon Button
```tsx
<button className="w-10 h-10 rounded-xl flex items-center justify-center
  text-zinc-400 hover:bg-white/10 hover:text-white
  active:scale-[0.95] transition-all">
  <Settings className="w-5 h-5" />
</button>
```

---

## 🃏 CARD VARİANTLARI

### Glass Card (Default)
```tsx
<div className="glass-card rounded-2xl p-5 glow-indigo">
  {/* content */}
</div>
```

### Card with Header
```tsx
<div className="glass-card rounded-2xl border border-white/10">
  <div className="px-5 py-4 border-b border-white/10">
    <h3 className="font-semibold text-white">Card Title</h3>
  </div>
  <div className="p-5">
    {/* content */}
  </div>
</div>
```

### Stat Card
```tsx
<div className="glass-card rounded-2xl p-5 glow-violet card-hover">
  <div className="icon-box icon-box-violet mb-4">
    <Building2 className="w-6 h-6" />
  </div>
  <p className="text-3xl font-bold text-white mb-1">42</p>
  <p className="text-sm text-zinc-500">Toplam Marka</p>
</div>
```

### List Item Card
```tsx
<div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10
  hover:bg-white/10 cursor-pointer transition-all">
  <div className="icon-box icon-box-emerald">
    <Server className="w-5 h-5" />
  </div>
  <div className="flex-1 min-w-0">
    <p className="font-medium text-white truncate">Item Title</p>
    <p className="text-sm text-zinc-500">Subtitle</p>
  </div>
  <ChevronRight className="w-5 h-5 text-zinc-600" />
</div>
```

---

## 🏷️ BADGE VARİANTLARI

```tsx
{/* Status Badges */}
<span className="badge badge-emerald">Aktif</span>
<span className="badge badge-amber">Beklemede</span>
<span className="badge badge-rose">Gecikmiş</span>
<span className="badge badge-violet">Premium</span>
<span className="badge badge-fuchsia">AI</span>
<span className="badge badge-neutral">Kategori</span>

{/* CSS */}
.badge {
  @apply text-xs px-2.5 py-1 rounded-full font-medium;
}
.badge-emerald {
  @apply bg-emerald-500/20 text-emerald-400 border border-emerald-500/20;
}
/* ... diğer renkler */
```

---

## 📊 PROGRESS BAR

```tsx
<div>
  <div className="flex justify-between mb-1.5">
    <span className="text-xs text-zinc-500">Brief Tamamlanma</span>
    <span className="text-xs font-mono font-semibold text-cyan-400">%75</span>
  </div>
  <div className="h-2 rounded-full bg-white/10">
    <div 
      className="h-full rounded-full progress-cyan transition-all duration-500"
      style={{ width: '75%' }}
    />
  </div>
</div>
```

**Progress Renkleri:**
| Yüzde | Class | Renk |
|-------|-------|------|
| 0-30% | progress-rose | Kırmızı |
| 31-70% | progress-amber | Turuncu |
| 71-99% | progress-cyan | Mavi |
| 100% | progress-emerald | Yeşil |

---

## 📋 TABLE

```tsx
<div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
  <table className="w-full">
    <thead>
      <tr className="border-b border-white/10">
        <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Kolon
        </th>
      </tr>
    </thead>
    <tbody className="divide-y divide-white/5">
      <tr className="hover:bg-white/5 transition-colors">
        <td className="px-5 py-4 text-sm text-white">Değer</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 🎭 MODAL / DIALOG

```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  {/* Overlay */}
  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
  
  {/* Modal */}
  <div className="relative w-full max-w-md rounded-2xl border border-white/10 shadow-2xl"
    style={{ backgroundColor: '#18181b' }}>
    
    {/* Header */}
    <div className="px-6 py-4 border-b border-white/10">
      <h2 className="text-lg font-semibold text-white">Modal Title</h2>
    </div>
    
    {/* Content */}
    <div className="p-6">
      {/* form veya içerik */}
    </div>
    
    {/* Footer */}
    <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
      <Button variant="outline">İptal</Button>
      <Button>Kaydet</Button>
    </div>
  </div>
</div>
```

---

## ✅ COMPONENT CHECKLIST

Yeni sayfa/component yaparken kontrol et:

- [ ] `dark:` prefix YOK
- [ ] Background: `bg-white/5` veya `glass-card`
- [ ] Text: `text-white`, `text-zinc-400`, `text-zinc-500`
- [ ] Border: `border-white/10`
- [ ] Hover: `hover:bg-white/10`
- [ ] Focus: `focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20`
- [ ] Rounded: `rounded-xl` (input/button), `rounded-2xl` (card)
- [ ] Height: `h-11` (input/button)
- [ ] Padding: `px-4` (input), `px-5` (button), `p-5` (card)
- [ ] Font size: `text-sm` (input/button/body)
- [ ] Transition: `transition-all`

---

## 🚫 YAPMA

1. ❌ `dark:` prefix kullanma
2. ❌ `bg-white` veya `text-black` kullanma
3. ❌ Farklı input height'ları (hep h-11)
4. ❌ Farklı border-radius'lar (hep rounded-xl)
5. ❌ Inline style (CSS class kullan)
6. ❌ Light mode conditional logic

---

*Bu dosyayı oku, kurallara uy, tutarlı UI üret.*
