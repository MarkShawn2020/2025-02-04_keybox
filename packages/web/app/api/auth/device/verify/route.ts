import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { user_code, token } = await request.json()

    // 验证 token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // 从数据库获取设备码信息
    const { data: deviceCode, error: dbError } = await supabase
      .from('device_codes')
      .select('*')
      .eq('user_code', user_code)
      .single()

    if (dbError || !deviceCode) {
      return NextResponse.json(
        { error: 'Invalid device code' },
        { status: 400 }
      )
    }

    if (deviceCode.expires_at && new Date(deviceCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Device code expired' },
        { status: 400 }
      )
    }

    // 更新设备码状态
    const { error: updateError } = await supabase
      .from('device_codes')
      .update({
        verified_at: new Date().toISOString(),
        verified_by: user.id
      })
      .eq('id', deviceCode.id)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to verify device code' },
        { status: 500 }
      )
    }

    // 返回回调信息
    return NextResponse.json({
      callback_url: deviceCode.callback_url,
      access_token: token
    })

  } catch (error) {
    console.error('Device verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
