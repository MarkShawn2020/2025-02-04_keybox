'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Terminal, AlertCircle, Loader2 } from 'lucide-react'

export default function VerifyDevice() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsVerifying(true)

    const {data: {session}} = await supabase.auth.getSession()

    if (!session) {
      setError('Please login first')
      return
    }

    try {
      // 验证设备码
      const res = await fetch(`/api/auth/device/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_code: code.toUpperCase(),
          token: session.access_token,
        }),
      })

      if (!res.ok) {
        throw new Error('Invalid verification code')
      }

      // 获取验证结果
      const { callback_url, access_token } = await res.json()
      
      // 调用 CLI 回调
      await fetch(callback_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token })
      })

      router.push('/cli/verify-device/success')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-8 py-10">
      <div className="group relative flex flex-col items-center gap-4 p-6 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-background rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="p-3 rounded-lg bg-primary/10 ring-1 ring-primary/20 group-hover:ring-primary/30 group-hover:bg-primary/20 transition-all duration-300">
          <Terminal className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-3xl font-bold tracking-tight">
          Verify Device
        </h2>
        <p className="text-muted-foreground max-w-md">
          Enter the verification code shown in your terminal to complete the device authorization process
        </p>
      </div>

      <div className="w-full max-w-sm space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Input
              id="code"
              name="code"
              type="text"
              required
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="font-mono text-center tracking-widest uppercase"
              maxLength={8}
              autoComplete="off"
              disabled={isVerifying}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isVerifying || !code}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Device'
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
