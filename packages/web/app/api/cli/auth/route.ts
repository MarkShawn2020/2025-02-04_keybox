import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const callbackUrl = searchParams.get('callback') || 'http://localhost:3333'
    const email = searchParams.get('email')
    const provider = searchParams.get('provider') || 'email'
    
    const cookieStore = cookies()
    const supabase = await createClient()

    if (provider === 'email') {
      if (!email) {
        return NextResponse.json({ 
          error: 'Email is required for email authentication' 
        }, { status: 400 })
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/auth/cli?redirect_url=${encodeURIComponent(callbackUrl)}`,
          data: {
            redirect_url: callbackUrl
          }
        }
      })

      if (error) {
        return NextResponse.json({ 
          error: error.message 
        }, { status: 400 })
      }

      return NextResponse.json({ 
        message: 'Please check your email for the magic link',
        email 
      })
    } 
    
    if (provider === 'github') {
      const { data: { url }, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/cli/auth/callback?redirect_url=${callbackUrl}`
        }
      })

      if (error || !url) {
        return NextResponse.json({ 
          error: error?.message || 'Failed to generate auth URL' 
        }, { status: 400 })
      }

      return NextResponse.redirect(url)
    }

    return NextResponse.json({ 
      error: `Unsupported provider: ${provider}` 
    }, { status: 400 })
  } catch (error) {
    console.error('CLI auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
