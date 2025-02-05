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
    let supabase
    try {
      supabase = await createClient()
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      return NextResponse.json({ error: 'Failed to initialize auth client' }, { status: 500 })
    }

    if (provider === 'email') {
      if (!email) {
        return NextResponse.json({ 
          error: 'Email is required for email authentication' 
        }, { status: 400 })
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const codeChallenge = searchParams.get('code_challenge')
      const codeChallengeMethod = searchParams.get('code_challenge_method')

      if (!codeChallenge || !codeChallengeMethod) {
        return NextResponse.json({ 
          error: 'PKCE parameters are required' 
        }, { status: 400 })
      }

      console.log('Sending magic link with PKCE:', {
        email,
        redirectTo: `${siteUrl}/auth/cli?callback=${encodeURIComponent(callbackUrl)}`,
        codeChallenge,
        codeChallengeMethod
      })

      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: `${siteUrl}/auth/cli?callback=${encodeURIComponent(callbackUrl)}`,
          // 启用 PKCE
          data: {
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
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
