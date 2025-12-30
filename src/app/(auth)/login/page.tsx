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
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      {/* Background Gradients */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 10% 10%, rgba(99,102,241,0.12) 0%, transparent 40%), radial-gradient(ellipse at 90% 90%, rgba(139,92,246,0.08) 0%, transparent 40%)'
        }}
      />
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          
          {/* Logo & Title */}
          <div className="text-center mb-8 animate-float">
            <div 
              className="inline-flex items-center justify-center h-20 w-20 rounded-2xl mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(234,179,8,0.1) 100%)',
                border: '1px solid rgba(255,214,0,0.4)',
                boxShadow: '0 0 20px -5px rgba(255,214,0,0.4)'
              }}
            >
              <AjansBeeLogoSVG className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Ajans Bee AI Platform</h1>
            <p className="text-sm text-zinc-500">Hesabınıza giriş yapın</p>
          </div>
          
          {/* Form Card */}
          <div 
            className="rounded-2xl p-8"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(139,92,246,0.4)',
              boxShadow: '0 0 30px -5px rgba(139,92,246,0.4)'
            }}
          >
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  {error}
                </div>
              )}
              
              {/* E-posta */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">E-posta</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="email" 
                    placeholder="ornek@ajans.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl text-sm text-white placeholder:text-zinc-600 transition-all focus:outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(139,92,246,0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>
              
              {/* Şifre */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Şifre</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm text-white placeholder:text-zinc-600 transition-all focus:outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(139,92,246,0.5)'
                      e.target.style.boxShadow = '0 0 0 3px rgba(139,92,246,0.15)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255,255,255,0.1)'
                      e.target.style.boxShadow = 'none'
                    }}
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
                className="w-full py-3.5 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)',
                  boxShadow: '0 10px 25px -5px rgba(99,102,241,0.4)'
                }}
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
                <span className="px-3 text-zinc-600" style={{ background: 'rgba(24,24,27,0.8)' }}>iletişim</span>
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
      
      {/* Float Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
