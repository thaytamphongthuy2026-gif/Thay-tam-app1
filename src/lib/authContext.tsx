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
  updateUserInfo: (updates: Partial<User>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const loadingRef = useState<AbortController | null>(null)[0]

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
        
        // Load user profile without blocking
        loadUserProfile(session.user.id).catch(err => {
          // Silently handle errors (already logged in loadUserProfile)
          if (err.name !== 'AbortError') {
            console.error('Failed to load user profile:', err)
          }
        })
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
      // Abort any pending profile loads
      if (loadingRef) {
        loadingRef.abort()
      }
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
        console.error('Error loading user profile:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        return // Don't throw, just return
      }
      
      if (data) {
        setUser(data as User)
      }
    } catch (error: any) {
      // Silently handle AbortError (request was cancelled)
      if (error.name === 'AbortError') {
        return
      }
      console.error('Error loading user profile:', {
        message: error.message,
        details: error.toString(),
        hint: error.hint || '',
        code: error.code || ''
      })
    }
  }

  async function refreshUser() {
    if (supabaseUser) {
      await loadUserProfile(supabaseUser.id)
    }
  }

  async function updateUserInfo(updates: Partial<User>) {
    if (!supabaseUser) {
      throw new Error('No user logged in')
    }

    try {
      // Convert DD/MM/YYYY to YYYY-MM-DD if birth_date is provided
      let dbUpdates = { ...updates }
      if (updates.birth_date && /^\d{2}\/\d{2}\/\d{4}$/.test(updates.birth_date)) {
        const [day, month, year] = updates.birth_date.split('/')
        dbUpdates.birth_date = `${year}-${month}-${day}`
      }

      const { error } = await supabase
        .from('users')
        .update({
          ...dbUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', supabaseUser.id)

      if (error) throw error

      // Refresh user data
      await refreshUser()
    } catch (error) {
      console.error('Error updating user info:', error)
      throw error
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setSupabaseUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, supabaseUser, loading, signOut, refreshUser, updateUserInfo }}>
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
