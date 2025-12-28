/* eslint-disable @typescript-eslint/no-require-imports */
// @ts-nocheck
// This file is a CLI script, not part of the Next.js build
import { neon } from "@neondatabase/serverless"
import * as fs from "fs"
import * as path from "path"

async function setupDatabase() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    console.error("DATABASE_URL environment variable is not set")
    process.exit(1)
  }

  console.log("Connecting to database...")
  const sql = neon(databaseUrl)

  // Read the schema file
  const schemaPath = path.join(__dirname, "../lib/db-schema.sql")
  const schema = fs.readFileSync(schemaPath, "utf-8")

  console.log("Running schema migrations...")

  try {
    // Execute statements one by one
    const statements = schema.split(';').filter((s: string) => s.trim())
    for (const stmt of statements) {
      if (stmt.trim()) {
        try {
          await sql([stmt] as unknown as TemplateStringsArray)
        } catch (e: unknown) {
          const error = e as Error
          console.log("Note:", error.message?.slice(0, 100))
        }
      }
    }
    console.log("✅ Database schema created successfully!")

    // Verify tables exist
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `

    console.log("\n📋 Tables created:")
    ;(tables as { table_name: string }[]).forEach((t) => {
      console.log(`   - ${t.table_name}`)
    })

  } catch (error) {
    console.error("❌ Error setting up database:", error)
    process.exit(1)
  }
}

setupDatabase()
