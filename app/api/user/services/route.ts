import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getUserServicesWithDetails } from '@/lib/db-queries'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const services = await getUserServicesWithDetails(userId)

    return NextResponse.json({ services })
  } catch (error) {
    console.error('Error fetching user services:', error)
    return NextResponse.json(
      { error: 'Failed to fetch services', services: [] },
      { status: 500 }
    )
  }
}
