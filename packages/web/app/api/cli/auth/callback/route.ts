import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

// 处理 CLI 的 code 交换请求
export async function POST(request: Request) {
  try {
    const { code, code_verifier } = await request.json()

    if (!code || !code_verifier) {
      return NextResponse.json({ 
        error: 'Code and code verifier are required' 
      }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 400 })
    }

    return NextResponse.json({ token: session.access_token })
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const callback = searchParams.get('callback') || 'http://localhost:3333'
    const codeVerifier = searchParams.get('code_verifier')

    if (!code) {
      return NextResponse.redirect(`${callback}?error=no_code`)
    }

    const cookieStore = cookies()
    const supabase = await createClient()

    // 使用 code 和 code_verifier 交换 session
    const { data: { session }, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Exchange code error:', error)
      return NextResponse.redirect(`${callback}?error=${error.message}`)
    }

    if (!session) {
      return NextResponse.redirect(`${callback}?error=no_session`)
    }

    // 将 code 传递给 CLI，由 CLI 使用 code_verifier 获取 token
    return NextResponse.redirect(`${callback}?code=${code}`)
  } catch (error) {
    console.error('CLI auth callback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
