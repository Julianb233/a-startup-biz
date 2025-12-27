"use client"

import { Suspense } from "react"
import ContactForm from "@/components/contact-form"

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <ContactForm />
    </Suspense>
  )
}
