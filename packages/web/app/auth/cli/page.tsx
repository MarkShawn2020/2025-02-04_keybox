'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const redirectUrl = searchParams.get('redirect_url')

  useEffect(() => {
    if (code) {
      // 构建回调 URL
      const callbackUrl = new URL('/api/cli/auth/callback', window.location.origin)
      callbackUrl.searchParams.set('code', code)
      if (redirectUrl) {
        callbackUrl.searchParams.set('redirect_url', redirectUrl)
      }
      
      // 重定向到回调处理
      window.location.href = callbackUrl.toString()
    }
  }, [code, redirectUrl])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
      <p className="text-gray-600">Please wait while we complete your authentication.</p>
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
