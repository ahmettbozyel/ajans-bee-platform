import { Settings, Bell, User, Shield, Palette, Globe } from 'lucide-react'

export default function AyarlarPage() {
  const settingsSections = [
    { name: 'Profil', description: 'Kullanıcı bilgilerini düzenle', icon: User },
    { name: 'Bildirimler', description: 'Bildirim tercihlerini yönet', icon: Bell },
    { name: 'Güvenlik', description: 'Şifre ve oturum ayarları', icon: Shield },
    { name: 'Görünüm', description: 'Tema ve dil ayarları', icon: Palette },
    { name: 'Entegrasyonlar', description: 'Üçüncü parti bağlantılar', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold">Ayarlar</h1>
        <p className="text-sm text-muted-foreground">Uygulama ayarlarını yönetin</p>
      </div>

      {/* Coming Soon Banner */}
      <div className="glass-card rounded-2xl p-6 border-glow-indigo">
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/20">
            <Settings className="h-8 w-8 text-indigo-500" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-semibold">Ayarlar Sayfası</h2>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-medium">Yakında</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Bu sayfa üzerinde çalışıyoruz. Çok yakında kullanıma hazır olacak.
            </p>
          </div>
        </div>
      </div>

      {/* Settings Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {settingsSections.map((section) => (
          <div 
            key={section.name}
            className="glass-card rounded-xl p-5 border border-zinc-200 dark:border-white/5 opacity-50 cursor-not-allowed"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                <section.icon className="h-5 w-5 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-600 dark:text-zinc-400">{section.name}</h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{section.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
