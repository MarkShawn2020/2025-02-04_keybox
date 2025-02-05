import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const redirectUrl = searchParams.get('redirect_url') || 'http://localhost:3333'

    if (!code) {
      return NextResponse.redirect(`${redirectUrl}?error=no_code`)
    }

    const cookieStore = cookies()
    const supabase = await createClient()

    // 先获取会话状态
    const { data: { session: existingSession } } = await supabase.auth.getSession()
    
    let session = existingSession
    
    // 如果没有会话，尝试用 code 交换
    if (!session) {
      const { data: { session: newSession }, error: exchangeError } = 
        await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Exchange code error:', exchangeError)
        return NextResponse.redirect(`${redirectUrl}?error=${exchangeError.message}`)
      }
      
      session = newSession
    }

    if (!session) {
      return NextResponse.redirect(`${redirectUrl}?error=no_session`)
    }

    // 将 access token 传递给 CLI
    return NextResponse.redirect(`${redirectUrl}?token=${session.access_token}`)
  } catch (error) {
    console.error('CLI auth callback error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
