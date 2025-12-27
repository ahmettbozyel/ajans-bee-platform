// =====================================================
// Technical Service Types - Karar #13
// Version: 1.2 - Standalone types (no circular imports)
// =====================================================

// Hizmet tipi (aligned with Database enum)
export type ServiceType = 'hosting' | 'domain' | 'ssl' | 'email';

// Ödeme durumu (aligned with Database enum)
export type PaymentStatus = 'pending' | 'paid' | 'overdue';

// TechnicalService interface (matches Database row)
export interface TechnicalService {
  id: string;
  created_at: string;
  updated_at: string;
  customer_id: string;
  user_id: string;
  service_type: ServiceType;
  name: string;
  platform: string | null;
  renewal_date: string | null;
  payment_status: PaymentStatus;
  price: number | null;
  notes: string | null;
}

// Form için partial tip
export type TechnicalServiceFormData = Partial<Omit<TechnicalService, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;

// Müşteri bilgisiyle birlikte (join için)
export interface TechnicalServiceWithCustomer extends TechnicalService {
  customer: {
    id: string;
    name: string;
    customer_type: 'retainer' | 'project';
  } | null;
}

// =====================================================
// Sabit Değerler
// =====================================================

export const SERVICE_TYPES = [
  { value: 'hosting', label: 'Hosting', icon: 'Server' },
  { value: 'domain', label: 'Domain', icon: 'Globe' },
  { value: 'ssl', label: 'SSL Sertifikası', icon: 'Shield' },
  { value: 'email', label: 'E-posta', icon: 'Mail' }
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Beklemede', color: 'yellow' },
  { value: 'paid', label: 'Ödendi', color: 'green' },
  { value: 'overdue', label: 'Gecikmiş', color: 'red' }
] as const;

export const PLATFORMS = [
  { value: 'siteground', label: 'Siteground' },
  { value: 'hostinger', label: 'Hostinger' },
  { value: 'natro', label: 'Natro' },
  { value: 'turhost', label: 'Turhost' },
  { value: 'godaddy', label: 'GoDaddy' },
  { value: 'cloudflare', label: 'Cloudflare' },
  { value: 'namecheap', label: 'Namecheap' },
  { value: 'google', label: 'Google Workspace' },
  { value: 'microsoft', label: 'Microsoft 365' },
  { value: 'yandex', label: 'Yandex Mail' },
  { value: 'other', label: 'Diğer' }
] as const;

// =====================================================
// Helper Fonksiyonlar
// =====================================================

// Yenileme tarihine kalan gün
export function getDaysUntilRenewal(renewalDate: string | null | undefined): number | null {
  if (!renewalDate) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const renewal = new Date(renewalDate);
  renewal.setHours(0, 0, 0, 0);
  
  const diffTime = renewal.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Yenileme durumu badge rengi
export function getRenewalBadgeColor(daysUntil: number | null): string {
  if (daysUntil === null) return 'gray';
  if (daysUntil < 0) return 'red'; // Geçmiş
  if (daysUntil <= 7) return 'red'; // 1 hafta
  if (daysUntil <= 30) return 'yellow'; // 1 ay
  return 'green'; // 1 aydan fazla
}

// Ödeme durumu badge rengi
export function getPaymentStatusColor(status: PaymentStatus): string {
  const statusObj = PAYMENT_STATUSES.find(s => s.value === status);
  return statusObj?.color || 'gray';
}

// Hizmet tipi label
export function getServiceTypeLabel(type: ServiceType): string {
  const typeObj = SERVICE_TYPES.find(t => t.value === type);
  return typeObj?.label || type;
}

// Ödeme durumu label
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const statusObj = PAYMENT_STATUSES.find(s => s.value === status);
  return statusObj?.label || status;
}
