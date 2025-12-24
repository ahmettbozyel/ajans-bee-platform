import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GorsellerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Görseller</h1>
        <p className="text-muted-foreground mt-1">
          AI ile görsel oluşturun ve yönetin
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
            Burada AI ile görsel oluşturabilecek ve görsel kütüphanenizi yönetebileceksiniz.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
