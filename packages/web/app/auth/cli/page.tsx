'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callback = searchParams.get('callback')
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function handleAuth() {
      const code = searchParams.get('code')

      if (code && callback) {
        try {
          // 直接把 code 传回 CLI，CLI 会使用 code_verifier 完成认证
          const callbackUrl = new URL(callback)
          callbackUrl.searchParams.set('code', code)
          window.location.href = callbackUrl.toString()
        } catch (error: any) {
          setError(error.message)
        }
        } catch (error: any) {
          console.error('Auth error:', error)
          setError(error.message || 'Authentication failed')
        }
      }
    }
    handleAuth()
  }, [callback, searchParams, supabase.auth])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      {error ? (
        <>
          <h1 className="text-2xl font-bold mb-4 text-red-600">Authentication Failed</h1>
          <p className="text-gray-600">{error}</p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
          <p className="text-gray-600">Please wait while we complete your authentication.</p>
        </>
      )}
    </div>
  )
}

export default function CliAuthPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
