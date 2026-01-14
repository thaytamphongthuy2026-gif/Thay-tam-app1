import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'premium'
  quota: {
    xemNgay: number
    tuVi: number
    chat: number
  }
  plan_expiry: string | null
}

export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  
  // Fetch user data from users table
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single()

  if (userError) throw userError

  return { user: data.user, profile: userData as User }
}

export async function register(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name, // Lưu name vào metadata để trigger dùng
      },
    },
  })

  if (error) throw error
  if (!data.user) throw new Error('Đăng ký thất bại')

  // Profile sẽ được tự động tạo bởi database trigger
  // Không cần insert thủ công nữa
  return data.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: userData, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) return null

  return userData as User
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
