// Bildirim tipleri
export interface Notification {
  id: string
  user_id: string
  type: 'late' | 'overtime' | 'early_leave' | 'leave_request' | 'system'
  title: string
  message: string
  is_read: boolean
  related_user_id?: string | null
  related_attendance_id?: string | null
  created_at: string
  // Join'den gelen
  related_user?: {
    full_name: string
  } | null
}

// Bildirim oluşturma helper
export async function createNotification(
  supabase: any,
  data: {
    user_id: string
    type: Notification['type']
    title: string
    message: string
    related_user_id?: string
    related_attendance_id?: string
  }
) {
  const { error } = await supabase
    .from('notifications')
    .insert(data)
  
  if (error) {
    console.error('Notification create error:', error)
  }
  return !error
}

// Admin'lere bildirim gönder
export async function notifyAdmins(
  supabase: any,
  data: {
    type: Notification['type']
    title: string
    message: string
    related_user_id?: string
    related_attendance_id?: string
  }
) {
  // Admin ID'lerini al
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('role', 'admin')
    .eq('is_active', true)
  
  if (!admins || admins.length === 0) return false
  
  // Her admin için bildirim oluştur
  const notifications = admins.map((admin: { id: string }) => ({
    user_id: admin.id,
    ...data
  }))
  
  const { error } = await supabase
    .from('notifications')
    .insert(notifications)
  
  if (error) {
    console.error('Notify admins error:', error)
  }
  return !error
}
