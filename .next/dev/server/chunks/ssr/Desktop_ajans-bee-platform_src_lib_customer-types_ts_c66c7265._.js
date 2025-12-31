module.exports = [
"[project]/Desktop/ajans-bee-platform/src/lib/customer-types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// =====================================================
// Customer Types - Genişletilmiş Brief Sistemi
// Version: 2.5 - Fatura İletişim Bilgileri Eklendi
// =====================================================
// Sosyal medya platform tipi
__turbopack_context__.s([
    "BRAND_VOICES",
    ()=>BRAND_VOICES,
    "BRIEF_SECTIONS",
    ()=>BRIEF_SECTIONS,
    "BRIEF_SECTIONS_NEW",
    ()=>BRIEF_SECTIONS_NEW,
    "BUSINESS_TYPES",
    ()=>BUSINESS_TYPES,
    "CUSTOMER_STATUSES",
    ()=>CUSTOMER_STATUSES,
    "CUSTOMER_TYPES",
    ()=>CUSTOMER_TYPES,
    "EMPTY_STATE_MESSAGES",
    ()=>EMPTY_STATE_MESSAGES,
    "FILE_CATEGORIES",
    ()=>FILE_CATEGORIES,
    "LOGO_CATEGORIES",
    ()=>LOGO_CATEGORIES,
    "PAYMENT_STATUSES",
    ()=>PAYMENT_STATUSES,
    "PRICE_SEGMENTS",
    ()=>PRICE_SEGMENTS,
    "SECTORS",
    ()=>SECTORS,
    "SERVICE_TYPES",
    ()=>SERVICE_TYPES,
    "SERVICE_TYPE_COLORS",
    ()=>SERVICE_TYPE_COLORS,
    "calculateBriefCompletion",
    ()=>calculateBriefCompletion,
    "calculateSectionCompletion",
    ()=>calculateSectionCompletion,
    "getCustomerStatusLabel",
    ()=>getCustomerStatusLabel,
    "getCustomerTypeLabel",
    ()=>getCustomerTypeLabel,
    "getProgressColor",
    ()=>getProgressColor,
    "getProgressTextColor",
    ()=>getProgressTextColor,
    "getServiceTypeColors",
    ()=>getServiceTypeColors
]);
const LOGO_CATEGORIES = [
    {
        value: 'primary',
        label: 'Ana Logo',
        description: 'Renkli, tam versiyon'
    },
    {
        value: 'white',
        label: 'Tek Renk (Beyaz)',
        description: 'Dark arka plan için'
    },
    {
        value: 'black',
        label: 'Tek Renk (Siyah)',
        description: 'Light arka plan için'
    },
    {
        value: 'icon',
        label: 'İkon/Favicon',
        description: 'Sadece sembol'
    },
    {
        value: 'vertical',
        label: 'Dikey',
        description: 'Dikey layout'
    },
    {
        value: 'horizontal',
        label: 'Yatay',
        description: 'Yatay layout'
    }
];
const FILE_CATEGORIES = [
    {
        value: 'logo',
        label: 'Logolar',
        icon: 'Image',
        description: 'Tüm logo varyasyonları'
    },
    {
        value: 'product',
        label: 'Ürün Görselleri',
        icon: 'Package',
        description: 'Ürün fotoğrafları'
    },
    {
        value: 'post',
        label: 'Örnek Postlar',
        icon: 'FileImage',
        description: 'Beğenilen içerik örnekleri'
    }
];
const SERVICE_TYPE_COLORS = {
    hosting: {
        bg: 'bg-cyan-100 dark:bg-cyan-500/20',
        text: 'text-cyan-700 dark:text-cyan-400',
        glow: 'glow-cyan'
    },
    domain: {
        bg: 'bg-amber-100 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        glow: 'glow-amber'
    },
    ssl: {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        glow: 'glow-emerald'
    },
    email: {
        bg: 'bg-violet-100 dark:bg-violet-500/20',
        text: 'text-violet-700 dark:text-violet-400',
        glow: 'glow-violet'
    }
};
const SERVICE_TYPES = [
    {
        value: 'hosting',
        label: 'Hosting',
        icon: 'Server'
    },
    {
        value: 'domain',
        label: 'Domain',
        icon: 'Globe'
    },
    {
        value: 'ssl',
        label: 'SSL',
        icon: 'ShieldCheck'
    },
    {
        value: 'email',
        label: 'E-posta',
        icon: 'Mail'
    }
];
const PAYMENT_STATUSES = [
    {
        value: 'pending',
        label: 'Bekliyor'
    },
    {
        value: 'paid',
        label: 'Ödendi'
    },
    {
        value: 'overdue',
        label: 'Gecikmiş'
    },
    {
        value: 'cancelled',
        label: 'İptal'
    }
];
const CUSTOMER_TYPES = [
    {
        value: 'retainer',
        label: 'Retainer',
        description: 'Aylık düzenli hizmet',
        icon: '🔄'
    },
    {
        value: 'project',
        label: 'Proje',
        description: 'Proje bazlı hizmet',
        icon: '📁'
    }
];
const CUSTOMER_STATUSES = [
    {
        value: 'active',
        label: 'Aktif',
        description: 'Aktif müşteri',
        icon: '✅'
    },
    {
        value: 'inactive',
        label: 'Pasif',
        description: 'İş bitti, teknik hizmet devam',
        icon: '⏸️'
    }
];
const BRIEF_SECTIONS_NEW = {
    markaKimligi: {
        id: 'marka-kimligi',
        label: 'Marka Kimliği',
        icon: 'Sparkles',
        fields: [
            'name',
            'customer_type',
            'status',
            'website_url',
            'sector',
            'sub_sector',
            'business_type',
            'brand_voice',
            'social_media',
            'brand_description',
            'mission',
            'vision',
            'slogan',
            'usp'
        ],
        required: [
            'name',
            'customer_type'
        ]
    },
    hedefKitle: {
        id: 'hedef-kitle',
        label: 'Hedef Kitle',
        icon: 'Users',
        fields: [
            'target_audience',
            'target_age_range',
            'target_geography'
        ],
        required: []
    },
    urunHizmet: {
        id: 'urun-hizmet',
        label: 'Ürün/Hizmet',
        icon: 'Package',
        fields: [
            'product_categories',
            'top_products',
            'price_segment'
        ],
        required: []
    },
    rakipler: {
        id: 'rakipler',
        label: 'Rakipler',
        icon: 'Target',
        fields: [
            'competitors'
        ],
        required: []
    },
    kurallar: {
        id: 'kurallar',
        label: 'İçerik Kuralları',
        icon: 'ShieldCheck',
        fields: [
            'do_not_do',
            'must_emphasize'
        ],
        required: []
    },
    ozelGunler: {
        id: 'ozel-gunler',
        label: 'Özel Günler',
        icon: 'Calendar',
        fields: [
            'special_events'
        ],
        required: []
    },
    faturaIletisim: {
        id: 'fatura-iletisim',
        label: 'Fatura İletişim',
        icon: 'Receipt',
        fields: [
            'billing_contact_name',
            'billing_contact_email',
            'billing_contact_phone'
        ],
        required: []
    }
};
const BRIEF_SECTIONS = {
    temelBilgiler: {
        id: 'temel',
        label: 'Temel Bilgiler',
        icon: 'Building2',
        fields: [
            'name',
            'customer_type',
            'status',
            'website_url',
            'sector',
            'sub_sector',
            'business_type',
            'brand_voice'
        ],
        required: [
            'name',
            'customer_type'
        ]
    },
    iletisim: {
        id: 'iletisim',
        label: 'İletişim',
        icon: 'Phone',
        fields: [
            'email',
            'phone',
            'location'
        ],
        required: []
    },
    sosyalMedya: {
        id: 'sosyal',
        label: 'Sosyal Medya',
        icon: 'Share2',
        fields: [
            'social_media'
        ],
        required: []
    },
    markaKimligi: {
        id: 'marka',
        label: 'Marka Kimliği',
        icon: 'Sparkles',
        fields: [
            'brand_description',
            'mission',
            'vision',
            'slogan',
            'usp'
        ],
        required: []
    },
    hedefKitle: {
        id: 'hedef',
        label: 'Hedef Kitle',
        icon: 'Users',
        fields: [
            'target_audience',
            'target_age_range',
            'target_geography'
        ],
        required: []
    },
    urunBilgileri: {
        id: 'urun',
        label: 'Ürün Bilgileri',
        icon: 'Package',
        fields: [
            'product_categories',
            'top_products',
            'price_segment'
        ],
        required: []
    },
    rekabet: {
        id: 'rekabet',
        label: 'Rekabet Analizi',
        icon: 'Target',
        fields: [
            'competitors'
        ],
        required: []
    },
    kurallar: {
        id: 'kurallar',
        label: 'İçerik Kuralları',
        icon: 'ShieldCheck',
        fields: [
            'do_not_do',
            'must_emphasize'
        ],
        required: []
    },
    takvim: {
        id: 'takvim',
        label: 'Özel Günler',
        icon: 'Calendar',
        fields: [
            'special_events'
        ],
        required: []
    },
    markaDegerleri: {
        id: 'degerler',
        label: 'Marka Değerleri',
        icon: 'Heart',
        fields: [
            'brand_values',
            'buying_motivations'
        ],
        required: []
    },
    icerikStratejisi: {
        id: 'strateji',
        label: 'İçerik Stratejisi',
        icon: 'Layers',
        fields: [
            'content_pillars'
        ],
        required: []
    },
    platformKurallari: {
        id: 'platform',
        label: 'Platform Kuralları',
        icon: 'Settings',
        fields: [
            'platform_rules'
        ],
        required: []
    },
    ornekIcerikler: {
        id: 'ornekler',
        label: 'Örnek İçerikler',
        icon: 'FileText',
        fields: [
            'example_captions'
        ],
        required: []
    },
    kelimeHaritasi: {
        id: 'kelime',
        label: 'Kelime Haritası',
        icon: 'BookOpen',
        fields: [
            'word_mapping'
        ],
        required: []
    },
    markaGorselleri: {
        id: 'gorseller',
        label: 'Marka Görselleri',
        icon: 'Palette',
        fields: [
            'brand_colors',
            'brand_fonts',
            'brand_assets'
        ],
        required: []
    },
    entegrasyonlar: {
        id: 'entegrasyon',
        label: 'Entegrasyonlar',
        icon: 'Link',
        fields: [
            'integrations'
        ],
        required: []
    },
    aiResearch: {
        id: 'ai-research',
        label: 'AI Araştırma',
        icon: 'Bot',
        fields: [
            'pain_points',
            'hook_sentences',
            'cta_standards',
            'forbidden_words',
            'seasonal_calendar'
        ],
        required: []
    },
    faturaIletisim: {
        id: 'fatura-iletisim',
        label: 'Fatura İletişim',
        icon: 'Receipt',
        fields: [
            'billing_contact_name',
            'billing_contact_email',
            'billing_contact_phone'
        ],
        required: []
    }
};
const SECTORS = [
    // Perakende & Ticaret
    {
        value: 'e-ticaret',
        label: 'E-Ticaret'
    },
    {
        value: 'perakende',
        label: 'Perakende'
    },
    {
        value: 'toptan',
        label: 'Toptan Ticaret'
    },
    // Gıda & İçecek
    {
        value: 'gida',
        label: 'Gıda & İçecek'
    },
    {
        value: 'restoran',
        label: 'Restoran & Kafe'
    },
    {
        value: 'catering',
        label: 'Catering & Organizasyon'
    },
    // Moda & Güzellik
    {
        value: 'tekstil',
        label: 'Tekstil & Moda'
    },
    {
        value: 'kozmetik',
        label: 'Kozmetik & Güzellik'
    },
    {
        value: 'kuyumculuk',
        label: 'Kuyumculuk & Aksesuar'
    },
    {
        value: 'ayakkabi',
        label: 'Ayakkabı & Çanta'
    },
    // Sağlık
    {
        value: 'saglik',
        label: 'Sağlık & Medikal'
    },
    {
        value: 'eczane',
        label: 'Eczane'
    },
    {
        value: 'dis',
        label: 'Diş Hekimliği'
    },
    {
        value: 'estetik',
        label: 'Estetik & Plastik Cerrahi'
    },
    {
        value: 'psikoloji',
        label: 'Psikoloji & Terapi'
    },
    {
        value: 'veteriner',
        label: 'Veterinerlik'
    },
    {
        value: 'spor-fitness',
        label: 'Spor & Fitness'
    },
    // Teknoloji & Yazılım
    {
        value: 'teknoloji',
        label: 'Teknoloji'
    },
    {
        value: 'yazilim',
        label: 'Yazılım & SaaS'
    },
    {
        value: 'ajans',
        label: 'Dijital Ajans'
    },
    {
        value: 'danismanlik-it',
        label: 'IT Danışmanlık'
    },
    // Eğitim
    {
        value: 'egitim',
        label: 'Eğitim'
    },
    {
        value: 'kurs',
        label: 'Kurs & Eğitim Merkezi'
    },
    {
        value: 'universite',
        label: 'Üniversite & Okul'
    },
    {
        value: 'cocuk',
        label: 'Çocuk Eğitimi'
    },
    // Finans & Hukuk
    {
        value: 'finans',
        label: 'Finans & Bankacılık'
    },
    {
        value: 'sigorta',
        label: 'Sigorta'
    },
    {
        value: 'muhasebe',
        label: 'Muhasebe & Mali Müşavirlik'
    },
    {
        value: 'hukuk',
        label: 'Hukuk & Avukatlık'
    },
    // Gayrimenkul & İnşaat
    {
        value: 'gayrimenkul',
        label: 'Gayrimenkul'
    },
    {
        value: 'insaat',
        label: 'İnşaat'
    },
    {
        value: 'mimarlik',
        label: 'Mimarlık & İç Tasarım'
    },
    {
        value: 'dekorasyon',
        label: 'Dekorasyon & Mobilya'
    },
    // Turizm & Konaklama
    {
        value: 'turizm',
        label: 'Turizm & Seyahat'
    },
    {
        value: 'otel',
        label: 'Otel & Konaklama'
    },
    {
        value: 'transfer',
        label: 'Transfer & Araç Kiralama'
    },
    // Otomotiv & Ulaşım
    {
        value: 'otomotiv',
        label: 'Otomotiv'
    },
    {
        value: 'oto-servis',
        label: 'Oto Servis & Yedek Parça'
    },
    {
        value: 'lojistik',
        label: 'Lojistik & Kargo'
    },
    // Enerji & Çevre
    {
        value: 'enerji',
        label: 'Enerji'
    },
    {
        value: 'yenilenebilir',
        label: 'Yenilenebilir Enerji'
    },
    {
        value: 'cevre',
        label: 'Çevre & Geri Dönüşüm'
    },
    // Üretim & Sanayi
    {
        value: 'uretim',
        label: 'Üretim & Sanayi'
    },
    {
        value: 'makine',
        label: 'Makine & Ekipman'
    },
    {
        value: 'kimya',
        label: 'Kimya & Plastik'
    },
    {
        value: 'ambalaj',
        label: 'Ambalaj'
    },
    // Tarım & Hayvancılık
    {
        value: 'tarim',
        label: 'Tarım'
    },
    {
        value: 'hayvancilik',
        label: 'Hayvancılık'
    },
    {
        value: 'organik',
        label: 'Organik Ürünler'
    },
    // Medya & Eğlence
    {
        value: 'medya',
        label: 'Medya & Yayıncılık'
    },
    {
        value: 'eglence',
        label: 'Eğlence & Etkinlik'
    },
    {
        value: 'muzik',
        label: 'Müzik & Sanat'
    },
    {
        value: 'oyun',
        label: 'Oyun & E-Spor'
    },
    // Hizmet
    {
        value: 'danismanlik',
        label: 'Danışmanlık'
    },
    {
        value: 'temizlik',
        label: 'Temizlik Hizmetleri'
    },
    {
        value: 'guvenlik',
        label: 'Güvenlik'
    },
    {
        value: 'hr',
        label: 'İnsan Kaynakları'
    },
    {
        value: 'fotograf',
        label: 'Fotoğraf & Video'
    },
    // STK & Kamu
    {
        value: 'stk',
        label: 'STK & Vakıf'
    },
    {
        value: 'kamu',
        label: 'Kamu & Belediye'
    },
    // Diğer
    {
        value: 'diger',
        label: 'Diğer'
    }
];
const BRAND_VOICES = [
    {
        value: 'samimi',
        label: 'Samimi',
        emoji: '🤝',
        icon: '🤝',
        description: 'Arkadaşça, sıcak'
    },
    {
        value: 'profesyonel',
        label: 'Profesyonel',
        emoji: '💼',
        icon: '💼',
        description: 'Ciddi, iş odaklı'
    },
    {
        value: 'kurumsal',
        label: 'Kurumsal',
        emoji: '🏢',
        icon: '🏢',
        description: 'Formal, resmi'
    },
    {
        value: 'enerjik',
        label: 'Enerjik',
        emoji: '⚡',
        icon: '⚡',
        description: 'Dinamik, heyecanlı'
    }
];
const BUSINESS_TYPES = [
    {
        value: 'B2B',
        label: 'B2B',
        description: 'İşletmeden işletmeye'
    },
    {
        value: 'B2C',
        label: 'B2C',
        description: 'İşletmeden tüketiciye'
    },
    {
        value: 'Both',
        label: 'Her İkisi',
        description: 'Hem B2B hem B2C'
    }
];
const PRICE_SEGMENTS = [
    {
        value: 'ekonomik',
        label: 'Ekonomik'
    },
    {
        value: 'orta',
        label: 'Orta Segment'
    },
    {
        value: 'premium',
        label: 'Premium'
    },
    {
        value: 'luks',
        label: 'Lüks'
    }
];
const EMPTY_STATE_MESSAGES = {
    dashboard_activity: "Henüz aktivite yok. İlk içeriği üretmek için bir marka seç! 🚀",
    files: "Henüz dosya yüklenmedi. Logo ve görselleri buraya yükle.",
    calendar: "Takvim boş. İçerik planlamaya başla!",
    content: "Henüz içerik üretilmedi. Hemen başla! ✨",
    performance: "Performans raporları çok yakında burada! 📊",
    brands: "Henüz marka eklenmedi. İlk markanı ekleyerek başla! 🐝"
};
function calculateBriefCompletion(customer) {
    const checkField = (value)=>{
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    };
    const allFields = [
        'name',
        'customer_type',
        'status',
        'website_url',
        'sector',
        'sub_sector',
        'business_type',
        'brand_voice',
        'email',
        'phone',
        'location',
        'social_media',
        'brand_description',
        'mission',
        'vision',
        'slogan',
        'usp',
        'target_audience',
        'target_age_range',
        'target_geography',
        'product_categories',
        'top_products',
        'price_segment',
        'competitors',
        'do_not_do',
        'must_emphasize',
        'special_events',
        'brand_values',
        'buying_motivations',
        'content_pillars',
        'platform_rules',
        'example_captions',
        'word_mapping',
        'brand_colors',
        'brand_fonts',
        'brand_assets',
        'integrations',
        'pain_points',
        'hook_sentences',
        'cta_standards',
        'forbidden_words',
        'seasonal_calendar',
        'billing_contact_name',
        'billing_contact_email',
        'billing_contact_phone'
    ];
    const filledFields = allFields.filter((field)=>checkField(customer[field]));
    return Math.round(filledFields.length / allFields.length * 100);
}
function calculateSectionCompletion(customer, fields) {
    const checkField = (value)=>{
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object') return Object.keys(value).length > 0;
        return true;
    };
    const filledFields = fields.filter((field)=>checkField(customer[field]));
    return fields.length > 0 ? Math.round(filledFields.length / fields.length * 100) : 0;
}
function getCustomerTypeLabel(type) {
    const found = CUSTOMER_TYPES.find((t)=>t.value === type);
    return found?.label || type;
}
function getCustomerStatusLabel(status) {
    const found = CUSTOMER_STATUSES.find((s)=>s.value === status);
    return found?.label || status;
}
function getServiceTypeColors(type) {
    return SERVICE_TYPE_COLORS[type] || SERVICE_TYPE_COLORS.hosting;
}
function getProgressColor(value) {
    if (value >= 100) return 'progress-emerald';
    if (value >= 71) return 'progress-cyan';
    if (value >= 31) return 'progress-amber';
    return 'progress-rose';
}
function getProgressTextColor(value) {
    if (value >= 100) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 71) return 'text-cyan-600 dark:text-cyan-400';
    if (value >= 31) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
}
}),
];

//# sourceMappingURL=Desktop_ajans-bee-platform_src_lib_customer-types_ts_c66c7265._.js.map