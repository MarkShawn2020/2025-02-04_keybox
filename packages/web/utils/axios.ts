import axios from 'axios'
import { createClient } from './supabase/client'

const API_BASE = 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：添加认证 token
api.interceptors.request.use(async (config) => {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('No active session')

  config.headers.Authorization = `Bearer ${session.access_token}`
  return config
})

export { api }
