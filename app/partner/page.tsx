import { redirect } from 'next/navigation'

/**
 * Partner Portal Landing Page
 * Redirects to the partner dashboard
 */
export default function PartnerPage() {
  redirect('/partner/dashboard')
}
