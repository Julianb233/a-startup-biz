import { redirect } from "next/navigation"

export default function PartnerPortalLogin() {
  // Redirect to dashboard - login handled separately
  redirect("/partner-portal/dashboard")
}
