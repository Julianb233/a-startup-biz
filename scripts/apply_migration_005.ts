
import { neon } from "@neondatabase/serverless"
import * as fs from "fs"
import * as path from "path"
import { config } from "dotenv"

// Load env vars
config({ path: ".env.local" })

async function applyMigration() {
    const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!databaseUrl) {
        console.error("DATABASE_URL or POSTGRES_URL environment variable is not set")
        process.exit(1)
    }

    console.log("Connecting to database...")
    const sql = neon(databaseUrl)

    // Read the migration file
    const migrationPath = path.join(process.cwd(), "supabase-migrations/005_handle_new_user.sql")
    console.log(`Reading migration from: ${migrationPath}`)
    const migrationSql = fs.readFileSync(migrationPath, "utf-8")

    console.log("Applying migration...")

    try {
        // Execute statements
        // We can't trust simple splitting by semicolon for complex PL/pgSQL functions.
        // Ideally we execute the whole file if the driver supports it.
        // neon driver usually takes a template string or query string.

        // For PL/pgSQL, splitting by ; is dangerous. 
        // However, the neon driver "sql" function might not handle multiple statements in one call depending on implementation.
        // But usually `await sql(migrationSql)` is risky if parameter substitution is expected.
        // `neon` returns a tagged template function but can also be called as a function?
        // checking docs or usage... `sql` is a tagged template literal function.
        // It can also be called as `sql(query, params)`.
        // Validating usage in setup-db.ts: await sql([stmt]...)

        // Use sql(...) as a tagged template requires pure literals for the query structure.
        // To execute a raw string from a file, we must use sql(string, params) or similar if supported,
        // but the error suggests sql.query might be available or we need a workaround.
        // Recent @neondatabase/serverless versions have stricter tagged template usage.

        // Attempting the method suggested by the error message:
        // "use sql.query("SELECT $1", [value], options)"

        // Note: The neon driver's return type might not explicitly show .query in all typescript definitions
        // but the runtime error confirms its existence.
        // Correct usage based on error message:
        await (sql as any).query?.(migrationSql) ?? (sql as any)(migrationSql, [])
        // Fallback looks weird but if .query exists use it.
        // Actually, simple update:
        if (typeof (sql as any).query === 'function') {
            await (sql as any).query(migrationSql)
        } else {
            // Fallback or fail
            await (sql as any)(migrationSql)
        }


        console.log("✅ Migration 005 applied successfully!")

    } catch (error) {
        console.error("❌ Error applying migration:", error)
        process.exit(1)
    }
}

applyMigration()
