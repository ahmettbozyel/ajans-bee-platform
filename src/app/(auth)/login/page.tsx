'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react'

// Ajans Bee Logo SVG
function AjansBeeLogoSVG({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 39.9 53.7">
      <polyline points="8.6,21.9 2.8,2.4 2.8,34.5" fill="#a1a1aa"/>
      <path d="M26.6,34.8c0,3.4-2.7,6.1-6.1,6.1s-6.1-2.7-6.1-6.1s2.7-6.1,6.1-6.1C23.9,28.7,26.6,31.4,26.6,34.8" fill="#FFD600"/>
      <path d="M38.3,34.8C38.3,25,30.3,17,20.5,17S2.8,25,2.8,34.8c0,7.2,4.3,13.3,10.4,16.1l2.3-6.7c-3.4-1.8-5.7-5.3-5.7-9.4c0-5.9,4.8-10.7,10.7-10.7s10.7,4.8,10.7,10.7c0,4-2.2,7.5-5.5,9.4l2.3,6.7C34,48.1,38.3,41.9,38.3,34.8" fill="#d4d4d8"/>
    </svg>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message === 'Invalid login credentials' 
          ? 'E-posta veya şifre hatalı' 
          : error.message)
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-body relative overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none bg-content" />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          {/* Logo & Title */}
          <div className="text-center mb-8 animate-float">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl mb-6 logo-container glow-bee">
              <AjansBeeLogoSVG className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Ajans Bee AI Platform</h1>
            <p className="text-sm text-zinc-500">Hesabınıza giriş yapın</p>
          </div>
          
          {/* Form Card */}
          <div className="glass-card rounded-2xl p-8 glow-violet">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  {error}
                </div>
              )}
              
              {/* E-posta */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="email" 
                    placeholder="ornek@ajans.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="input-dark pl-12"
                  />
                </div>
              </div>
              
              {/* Şifre */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-zinc-400">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="input-dark pl-12 pr-12"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-violet-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              {/* Giriş Butonu */}
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Giriş Yap
                  </>
                )}
              </button>
              
            </form>
            
            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 text-zinc-600 bg-[#18181b]">iletişim</span>
              </div>
            </div>
            
            {/* İletişim */}
            <p className="text-center text-sm text-zinc-500 flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              <a href="mailto:info@ajansbee.com" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                info@ajansbee.com
              </a>
            </p>
          </div>
          
          {/* Footer */}
          <p className="text-center text-xs text-zinc-600 mt-6">© 2025 Ajans Bee. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </div>
  )
}
