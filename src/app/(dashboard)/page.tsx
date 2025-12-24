import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PenTool, Image, FileText, Users } from 'lucide-react'
import Link from 'next/link'

const quickActions = [
  {
    title: 'İçerik Üret',
    description: 'AI ile sosyal medya içeriği oluştur',
    href: '/icerik-uret',
    icon: PenTool,
    color: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    title: 'Görseller',
    description: 'AI ile görsel oluştur',
    href: '/gorseller',
    icon: Image,
    color: 'bg-blue-500/10 text-blue-600',
  },
  {
    title: 'Geçmiş',
    description: 'Önceki içerikleri görüntüle',
    href: '/gecmis',
    icon: FileText,
    color: 'bg-green-500/10 text-green-600',
  },
  {
    title: 'Müşteriler',
    description: 'Müşteri brief\'lerini yönet',
    href: '/musteriler',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-600',
  },
]

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // İstatistikleri çek (şimdilik statik, sonra dinamik yapılacak)
  const stats = {
    totalPosts: 0,
    totalCustomers: 0,
    thisWeekPosts: 0,
  }

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-2xl font-bold">
          Hoş geldin, {user?.user_metadata?.full_name?.split(' ')[0] || 'Kullanıcı'} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Ajans Bee AI Platform&apos;a hoş geldiniz. Hemen içerik üretmeye başlayın.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Toplam İçerik</CardDescription>
            <CardTitle className="text-3xl">{stats.totalPosts}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Müşteri Sayısı</CardDescription>
            <CardTitle className="text-3xl">{stats.totalCustomers}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Bu Hafta</CardDescription>
            <CardTitle className="text-3xl">{stats.thisWeekPosts}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Hızlı İşlemler</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Son Aktiviteler</CardTitle>
          <CardDescription>Son üretilen içerikler burada görünecek</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Henüz içerik üretilmedi. Hemen başlamak için &quot;İçerik Üret&quot; butonuna tıklayın.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
