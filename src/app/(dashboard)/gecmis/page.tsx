import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GecmisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Geçmiş</h1>
        <p className="text-muted-foreground mt-1">
          Önceden üretilen içerikleri görüntüleyin
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🚧 Yapım Aşamasında</CardTitle>
          <CardDescription>
            Bu sayfa henüz geliştirme aşamasında. Yakında kullanıma açılacak.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Burada önceden üretilen içerikleri listeleyebilecek, düzenleyebilecek ve tekrar kullanabileceksiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
