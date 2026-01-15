import { createContext, useContext, useEffect, useState } from 'react'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface User {
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
  birth_date?: string
  birth_date_type?: 'lunar' | 'solar'
  gender?: 'male' | 'female' | 'other'
  profile_completed?: boolean
}

interface AuthContextType {
  user: User | null
  supabaseUser: SupabaseUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active session
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (session?.user) {
        setSupabaseUser(session.user)
        
        // Sync to localStorage for Payment API
        if (session.access_token) {
          localStorage.setItem('jwt_token', session.access_token)
          localStorage.setItem('user_email', session.user.email || '')
        }
        
        await loadUserProfile(session.user.id)
      } else {
        setSupabaseUser(null)
        setUser(null)
        
        // Clear localStorage
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_email')
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setSupabaseUser(session.user)
        await loadUserProfile(session.user.id)
      }
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  async function loadUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle() // Use maybeSingle instead of single to avoid errors

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "not found" - ignore it
        throw error
      }
      
      if (data) {
        setUser(data as User)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  async function refreshUser() {
    if (supabaseUser) {
      await loadUserProfile(supabaseUser.id)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
