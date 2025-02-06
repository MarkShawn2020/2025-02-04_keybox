
import { randomBytes } from 'crypto';
import { createClient } from '../supabase/server';

export async function generateDeviceCode(callback_url: string) {
  const supabase = await createClient()
  
  const deviceCode = randomBytes(32).toString('hex');
  const userCode = randomBytes(4).toString('hex').toUpperCase();
  
  // 设置过期时间为 10 分钟后
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);
  
  // 保存设备码到数据库
  const { error } = await supabase
    .from('device_codes')
    .insert({
      device_code: deviceCode,
      user_code: userCode,
      callback_url,
      expires_at: expiresAt.toISOString()
    });
  
  if (error) {
    throw new Error('Failed to generate device code');
  }
  
  return {
    device_code: deviceCode,
    user_code: userCode,
    expires_in: 600, // 10 minutes
  };
}

export async function verifyDeviceCode(device_code: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('device_codes')
    .select('*')
    .eq('device_code', device_code)
    .single();
  
  if (error || !data) {
    return { error: 'Device code not found' };
  }
  
  if (new Date(data.expires_at) < new Date()) {
    return { error: 'Device code expired' };
  }
  
  if (!data.verified_at) {
    return { error: 'Authorization pending' };
  }
  
  return { success: true };
}

export async function authorizeDevice(device_code: string, user_code: string) {
  const supabase = await createClient()
  
  // 获取设备码信息
  const { data, error } = await supabase
    .from('device_codes')
    .select('*')
    .eq('device_code', device_code)
    .eq('user_code', user_code)
    .single();
  
  if (error || !data) {
    return { error: 'Invalid device code' };
  }
  
  if (new Date(data.expires_at) < new Date()) {
    return { error: 'Device code expired' };
  }
  
  // 获取当前用户会话
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { error: 'User not authenticated' };
  }
  
  // 更新设备码状态
  const { error: updateError } = await supabase
    .from('device_codes')
    .update({
      verified_at: new Date().toISOString(),
      verified_by: session.user.id
    })
    .eq('id', data.id);
  
  if (updateError) {
    return { error: 'Failed to authorize device' };
  }
  
  return {
    success: true,
    callback_url: data.callback_url,
    access_token: session.access_token
  };
}
