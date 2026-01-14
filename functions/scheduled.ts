import type { Env } from './_lib/database'

interface ScheduledEvent {
  scheduledTime: number
  cron: string
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void
  passThroughOnException(): void
}

/**
 * Cloudflare Workers Scheduled Event Handler
 * Runs daily at 00:00 UTC+7 (17:00 UTC) to reset user quotas
 */
export async function onScheduled(
  event: ScheduledEvent,
  env: Env,
  ctx: ExecutionContext
) {
  console.log('🕐 Cron triggered at:', new Date(event.scheduledTime).toISOString())
  console.log('📅 Cron pattern:', event.cron)

  try {
    // Reset quota for all users based on their plan
    const resetStartTime = Date.now()

    // Free plan: 3 xemNgay, 1 tuVi, 10 chat
    const freeQuota = { xemNgay: 3, tuVi: 1, chat: 10 }
    
    // Pro plan: 50 xemNgay, 10 tuVi, 100 chat
    const proQuota = { xemNgay: 50, tuVi: 10, chat: 100 }
    
    // Premium plan: 999 (unlimited)
    const premiumQuota = { xemNgay: 999, tuVi: 999, chat: 999 }

    // Update all free users
    const freeResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?plan=eq.free`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ quota: freeQuota }),
      }
    )

    if (!freeResponse.ok) {
      throw new Error(`Failed to reset free users: ${await freeResponse.text()}`)
    }

    const freeUsers = await freeResponse.json()
    console.log(`✅ Reset ${freeUsers.length} free users`)

    // Update all pro users (active only)
    const proResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?plan=eq.pro&plan_expiry=gt.${new Date().toISOString()}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ quota: proQuota }),
      }
    )

    if (!proResponse.ok) {
      throw new Error(`Failed to reset pro users: ${await proResponse.text()}`)
    }

    const proUsers = await proResponse.json()
    console.log(`✅ Reset ${proUsers.length} pro users`)

    // Update all premium users (active only)
    const premiumResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?plan=eq.premium&plan_expiry=gt.${new Date().toISOString()}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ quota: premiumQuota }),
      }
    )

    if (!premiumResponse.ok) {
      throw new Error(`Failed to reset premium users: ${await premiumResponse.text()}`)
    }

    const premiumUsers = await premiumResponse.json()
    console.log(`✅ Reset ${premiumUsers.length} premium users`)

    // Downgrade expired pro/premium users to free
    const expiredResponse = await fetch(
      `${env.SUPABASE_URL}/rest/v1/users?plan=in.(pro,premium)&plan_expiry=lt.${new Date().toISOString()}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': env.SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ 
          plan: 'free',
          quota: freeQuota 
        }),
      }
    )

    if (!expiredResponse.ok) {
      throw new Error(`Failed to downgrade expired users: ${await expiredResponse.text()}`)
    }

    const expiredUsers = await expiredResponse.json()
    console.log(`⬇️ Downgraded ${expiredUsers.length} expired users to free`)

    const resetDuration = Date.now() - resetStartTime
    const totalUsers = freeUsers.length + proUsers.length + premiumUsers.length

    console.log(`🎉 Quota reset completed successfully!`)
    console.log(`📊 Stats:`)
    console.log(`   - Free: ${freeUsers.length}`)
    console.log(`   - Pro: ${proUsers.length}`)
    console.log(`   - Premium: ${premiumUsers.length}`)
    console.log(`   - Expired downgraded: ${expiredUsers.length}`)
    console.log(`   - Total: ${totalUsers}`)
    console.log(`⏱️ Duration: ${resetDuration}ms`)

    // Log to analytics (optional - for monitoring)
    // You can integrate with Cloudflare Analytics or external service here

  } catch (error: any) {
    console.error('❌ Quota reset failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
    
    // TODO: Send alert to admin (email, Slack, etc.)
    throw error
  }
}
