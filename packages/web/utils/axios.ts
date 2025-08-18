import axios from 'axios'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Note: Authentication has been removed since the system no longer uses Supabase auth
// If you need authentication for API calls, implement it according to your new auth system

export { api }
