
import { createClient } from "@supabase/supabase-js"
import { config } from "dotenv"

// Load env vars
config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for admin access

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyTrigger() {
  const timestamp = Date.now()
  const email = `test-trigger-${timestamp}@example.com`
  const password = "test-password-123"
  const name = `Test User ${timestamp}`

  console.log(`1. Creating Auth User: ${email}...`)
  
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { full_name: name },
    email_confirm: true
  })

  if (authError) {
    console.error("Error creating auth user:", authError)
    process.exit(1)
  }

  const userId = authData.user.id
  console.log(`   Success! Auth User ID: ${userId}`)

  console.log(`2. Verifying public.users record...`)
  
  // Wait a short moment for trigger to fire (usually instant, but safety buffer)
  await new Promise(resolve => setTimeout(resolve, 1000))

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single()

  if (userError) {
    console.error("Error fetching public user:", userError)
    console.error("Trigger likely FAILED.")
    process.exit(1)
  }

  if (userData) {
    console.log("   Success! Public user found.")
    console.log("   Data:", userData)
    
    if (userData.email === email && userData.name === name) {
        console.log("   ✅ Verification PASSED: public.users is in sync.")
    } else {
        console.error("   ❌ Verification FAILED: Data mismatch.")
    }

    // Cleanup
    console.log("3. Cleaning up...")
    await supabase.auth.admin.deleteUser(userId)
    // public.users should cascade delete if set up correctly, or we delete manually
    // checking cascade...
    const { error: deleteError } = await supabase.from("users").delete().eq("id", userId)
    if (deleteError) console.log("   Note: Manual delete from public.users failed or not needed:", deleteError.message)
    
  } else {
    console.error("   ❌ Verification FAILED: No record in public.users.")
    process.exit(1)
  }
}

verifyTrigger()
