'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Ana sayfa dashboard'a yönlendirsin
export default function DashboardRootPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace('/dashboard')
  }, [router])
  
  return null
}
