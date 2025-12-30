/**
 * Seed script for Partner Portal test data
 * Run with: DATABASE_URL="..." npx tsx scripts/seed-partner-data.ts
 */

import { neon } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is required')
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function seedPartnerData() {
  console.log('🌱 Starting Partner Portal seed...\n')

  try {
    // 1. Check for existing test user or create one
    console.log('1️⃣ Checking for test user...')

    const existingUsers = await sql`
      SELECT id, email, name FROM users
      WHERE email = 'testpartner@example.com'
      LIMIT 1
    `

    let userId: string

    if (existingUsers.length > 0) {
      userId = existingUsers[0].id
      console.log(`   ✅ Found existing test user: ${existingUsers[0].email}`)
    } else {
      // Create a test user
      const newUser = await sql`
        INSERT INTO users (email, name, role, status)
        VALUES ('testpartner@example.com', 'Test Partner User', 'partner', 'active')
        RETURNING id, email
      `
      userId = newUser[0].id
      console.log(`   ✅ Created test user: ${newUser[0].email}`)
    }

    // 2. Check for existing partner or create one
    console.log('\n2️⃣ Checking for test partner...')

    const existingPartners = await sql`
      SELECT id, company_name, status FROM partners
      WHERE user_id = ${userId}
      LIMIT 1
    `

    let partnerId: string

    if (existingPartners.length > 0) {
      partnerId = existingPartners[0].id
      console.log(`   ✅ Found existing partner: ${existingPartners[0].company_name}`)
    } else {
      // Create a test partner
      const newPartner = await sql`
        INSERT INTO partners (user_id, company_name, status, commission_rate, rank)
        VALUES (${userId}, 'Test Marketing Agency', 'active', 15.00, 'Silver')
        RETURNING id, company_name
      `
      partnerId = newPartner[0].id
      console.log(`   ✅ Created test partner: ${newPartner[0].company_name}`)
    }

    // 3. Create partner profile if it doesn't exist
    console.log('\n3️⃣ Setting up partner profile...')

    const existingProfile = await sql`
      SELECT id FROM partner_profiles WHERE partner_id = ${partnerId}
    `

    if (existingProfile.length === 0) {
      await sql`
        INSERT INTO partner_profiles (
          partner_id,
          contact_name,
          contact_email,
          contact_phone,
          website,
          notifications_enabled,
          email_notifications
        )
        VALUES (
          ${partnerId},
          'John Partner',
          'testpartner@example.com',
          '555-123-4567',
          'https://example.com',
          true,
          true
        )
      `
      console.log('   ✅ Created partner profile')
    } else {
      console.log('   ✅ Partner profile already exists')
    }

    // 4. Create test leads with various statuses
    console.log('\n4️⃣ Creating test leads...')

    // Check existing leads count
    const existingLeads = await sql`
      SELECT COUNT(*) as count FROM partner_leads WHERE partner_id = ${partnerId}
    `

    const leadCount = parseInt(existingLeads[0].count)

    if (leadCount >= 10) {
      console.log(`   ✅ Partner already has ${leadCount} leads, skipping seed`)
    } else {
      // Create diverse test leads
      const testLeads = [
        { name: 'Acme Corporation', email: 'contact@acme.com', phone: '555-111-1111', service: 'Website Development', status: 'converted', commission: 500 },
        { name: 'Tech Startup Inc', email: 'info@techstartup.io', phone: '555-222-2222', service: 'SEO Services', status: 'converted', commission: 350 },
        { name: 'Green Energy Co', email: 'hello@greenenergy.com', phone: '555-333-3333', service: 'Digital Marketing', status: 'converted', commission: 750 },
        { name: 'Local Restaurant', email: 'owner@localfood.com', phone: '555-444-4444', service: 'Logo Design', status: 'qualified', commission: 200 },
        { name: 'Fitness Studio', email: 'manager@fitgym.com', phone: '555-555-5555', service: 'Social Media', status: 'qualified', commission: 300 },
        { name: 'Law Firm LLC', email: 'office@lawfirm.com', phone: '555-666-6666', service: 'Website Development', status: 'contacted', commission: 800 },
        { name: 'Real Estate Group', email: 'sales@realestate.com', phone: '555-777-7777', service: 'SEO Services', status: 'contacted', commission: 400 },
        { name: 'Coffee Shop', email: 'brew@coffeeshop.com', phone: '555-888-8888', service: 'Logo Design', status: 'pending', commission: 150 },
        { name: 'Pet Store', email: 'pets@petstore.com', phone: '555-999-9999', service: 'Digital Marketing', status: 'pending', commission: 250 },
        { name: 'Auto Shop', email: 'service@autoshop.com', phone: '555-000-0000', service: 'Website Development', status: 'lost', commission: 600 },
      ]

      for (const lead of testLeads) {
        // Check if lead already exists
        const existing = await sql`
          SELECT id FROM partner_leads
          WHERE partner_id = ${partnerId} AND client_email = ${lead.email}
        `

        if (existing.length === 0) {
          const convertedAt = lead.status === 'converted'
            ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            : null
          const createdAt = new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)

          await sql`
            INSERT INTO partner_leads (
              partner_id,
              client_name,
              client_email,
              client_phone,
              service,
              status,
              commission,
              commission_paid,
              created_at,
              converted_at
            )
            VALUES (
              ${partnerId},
              ${lead.name},
              ${lead.email},
              ${lead.phone},
              ${lead.service},
              ${lead.status},
              ${lead.commission},
              ${lead.status === 'converted' && Math.random() > 0.5},
              ${createdAt.toISOString()},
              ${convertedAt?.toISOString() ?? null}
            )
          `
          console.log(`   ✅ Created lead: ${lead.name} (${lead.status})`)
        } else {
          console.log(`   ⏭️ Lead exists: ${lead.name}`)
        }
      }
    }

    // 5. Verify and display stats
    console.log('\n5️⃣ Verifying partner data...')

    const finalStats = await sql`
      SELECT
        p.company_name,
        p.status,
        p.total_referrals,
        p.total_earnings,
        p.paid_earnings,
        p.pending_earnings,
        p.rank
      FROM partners p
      WHERE p.id = ${partnerId}
    `

    const leadsByStatus = await sql`
      SELECT status, COUNT(*) as count
      FROM partner_leads
      WHERE partner_id = ${partnerId}
      GROUP BY status
    `

    console.log('\n📊 Partner Stats:')
    console.log(`   Company: ${finalStats[0].company_name}`)
    console.log(`   Status: ${finalStats[0].status}`)
    console.log(`   Rank: ${finalStats[0].rank}`)
    console.log(`   Total Referrals: ${finalStats[0].total_referrals}`)
    console.log(`   Total Earnings: $${finalStats[0].total_earnings}`)
    console.log(`   Paid Earnings: $${finalStats[0].paid_earnings}`)
    console.log(`   Pending Earnings: $${finalStats[0].pending_earnings}`)

    console.log('\n📈 Leads by Status:')
    for (const stat of leadsByStatus) {
      console.log(`   ${stat.status}: ${stat.count}`)
    }

    console.log('\n✨ Seed completed successfully!')
    console.log('\n📝 Test User Credentials:')
    console.log('   Email: testpartner@example.com')
    console.log('   (Use this email to log in and test partner features)')

  } catch (error) {
    console.error('\n❌ Seed failed:', error)
    process.exit(1)
  }
}

seedPartnerData()
